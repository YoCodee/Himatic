import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamSchema } from "@/lib/validations";

// GET: Fetch current user's team
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const team = await prisma.team.findUnique({
    where: { userId: parseInt(session.user.id) },
    include: {
      members: true,
      messages: {
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { username: true } } },
      },
    },
  });

  // Also fetch competition settings
  const settings = await prisma.competitionSetting.findMany();

  return Response.json({ team, settings });
}

// POST: Create a new team
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  // Check if user already has a team
  const existing = await prisma.team.findUnique({ where: { userId } });
  if (existing) {
    return Response.json(
      { error: "Kamu sudah memiliki tim. Gunakan edit untuk mengubah data." },
      { status: 409 }
    );
  }

  try {
    const body = await request.json();
    const parsed = teamSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { teamName, competition, githubLink, figmaLink, driveLink, leader, members } = parsed.data;

    // Validate competition is open and not past deadline
    const setting = await prisma.competitionSetting.findUnique({
      where: { competitionId: competition },
    });

    if (!setting || !setting.isOpen) {
      return Response.json(
        { error: "Pendaftaran lomba ini sudah ditutup" },
        { status: 400 }
      );
    }

    if (new Date() > setting.deadline) {
      return Response.json(
        { error: "Batas waktu pendaftaran sudah lewat" },
        { status: 400 }
      );
    }

    // Validate member count
    const allMembers = [{ ...leader, isLeader: true }, ...(members || []).map((m) => ({ ...m, isLeader: false }))];
    if (allMembers.length > setting.maxMembers) {
      return Response.json(
        { error: `Maksimal ${setting.maxMembers} anggota untuk lomba ini` },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        userId,
        teamName,
        competition,
        githubLink: githubLink || null,
        figmaLink: figmaLink || null,
        driveLink: driveLink || null,
        status: "SUBMITTED",
        submittedAt: new Date(),
        members: {
          create: allMembers,
        },
      },
      include: { members: true },
    });

    return Response.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Create team error:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamSchema } from "@/lib/validations";

// GET: Get team detail
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const teamId = parseInt(id);

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: true,
      messages: {
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { username: true } } },
      },
      user: { select: { username: true, email: true } },
    },
  });

  if (!team) {
    return Response.json({ error: "Tim tidak ditemukan" }, { status: 404 });
  }

  // Only owner or admin can view
  const isOwner = team.userId === parseInt(session.user.id);
  const isAdmin = (session.user as { role: string }).role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json({ team });
}

// PUT: Update team data
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const teamId = parseInt(id);

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) {
    return Response.json({ error: "Tim tidak ditemukan" }, { status: 404 });
  }

  if (team.userId !== parseInt(session.user.id)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Can only edit if not verified
  if (team.status === "VERIFIED") {
    return Response.json(
      { error: "Tim sudah terverifikasi, tidak bisa diedit" },
      { status: 400 }
    );
  }

  // Check deadline
  const setting = await prisma.competitionSetting.findUnique({
    where: { competitionId: team.competition },
  });

  if (setting && new Date() > setting.deadline) {
    return Response.json(
      { error: "Batas waktu pengumpulan sudah lewat" },
      { status: 400 }
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

    const allMembers = [
      { ...leader, isLeader: true },
      ...(members || []).map((m) => ({ ...m, isLeader: false })),
    ];

    // Delete old members and create new ones in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      await tx.teamMember.deleteMany({ where: { teamId } });

      return tx.team.update({
        where: { id: teamId },
        data: {
          teamName,
          competition,
          githubLink: githubLink || null,
          figmaLink: figmaLink || null,
          driveLink: driveLink || null,
          status: "SUBMITTED",
          submittedAt: new Date(),
          members: { create: allMembers },
        },
        include: { members: true },
      });
    });

    return Response.json({ team: updated });
  } catch (error) {
    console.error("Update team error:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

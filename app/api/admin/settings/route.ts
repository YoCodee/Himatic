import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Get competition settings
export async function GET() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.competitionSetting.findMany();
  return Response.json({ settings });
}

// PUT: Update competition settings
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { competitionId, deadline, isOpen } = body;

  if (!competitionId) {
    return Response.json({ error: "competitionId wajib diisi" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (deadline !== undefined) data.deadline = new Date(deadline);
  if (isOpen !== undefined) data.isOpen = isOpen;

  const updated = await prisma.competitionSetting.update({
    where: { competitionId },
    data,
  });

  return Response.json({ setting: updated });
}

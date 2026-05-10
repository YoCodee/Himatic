import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Get messages for a team
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

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return Response.json({ error: "Tim tidak ditemukan" }, { status: 404 });
  }

  const isOwner = team.userId === parseInt(session.user.id);
  const isAdmin = (session.user as { role: string }).role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.adminMessage.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { username: true } } },
  });

  return Response.json({ messages });
}

// PATCH: Mark messages as read
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const teamId = parseInt(id);

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team || team.userId !== parseInt(session.user.id)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.adminMessage.updateMany({
    where: { teamId, isRead: false },
    data: { isRead: true },
  });

  return Response.json({ success: true });
}

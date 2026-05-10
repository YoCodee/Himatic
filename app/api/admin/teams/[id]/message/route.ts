import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminMessageSchema } from "@/lib/validations";

// POST: Send message to a team (auto-sets status to REVISION)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const teamId = parseInt(id);
  const body = await request.json();

  const parsed = adminMessageSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return Response.json({ error: "Tim tidak ditemukan" }, { status: 404 });
  }

  // Create message and update status to REVISION in a transaction
  const [message] = await prisma.$transaction([
    prisma.adminMessage.create({
      data: {
        teamId,
        adminId: parseInt(session.user.id),
        message: parsed.data.message,
      },
    }),
    prisma.team.update({
      where: { id: teamId },
      data: { status: "REVISION" },
    }),
  ]);

  return Response.json({ message }, { status: 201 });
}

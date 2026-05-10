import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH: Update team status (VERIFIED / REVISION)
export async function PATCH(
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
  const { status } = body;

  if (!["VERIFIED", "REVISION"].includes(status)) {
    return Response.json(
      { error: "Status tidak valid. Gunakan VERIFIED atau REVISION." },
      { status: 400 }
    );
  }

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return Response.json({ error: "Tim tidak ditemukan" }, { status: 404 });
  }

  const updated = await prisma.team.update({
    where: { id: teamId },
    data: { status },
  });

  return Response.json({ team: updated });
}

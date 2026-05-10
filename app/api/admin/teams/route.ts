import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role: string }).role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const competition = searchParams.get("competition");
  const status = searchParams.get("status");

  const where: Record<string, string> = {};
  if (competition) where.competition = competition;
  if (status) where.status = status;

  const teams = await prisma.team.findMany({
    where,
    include: {
      user: { select: { username: true, email: true } },
      members: true,
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Stats
  const stats = {
    total: teams.length,
    submitted: teams.filter((t) => t.status === "SUBMITTED").length,
    verified: teams.filter((t) => t.status === "VERIFIED").length,
    revision: teams.filter((t) => t.status === "REVISION").length,
    draft: teams.filter((t) => t.status === "DRAFT").length,
    uiux: teams.filter((t) => t.competition === "uiux").length,
    webdev: teams.filter((t) => t.competition === "webdev").length,
  };

  return Response.json({ teams, stats });
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(
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

  if (team.userId !== parseInt(session.user.id)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Format file tidak didukung. Gunakan JPG, PNG, atau PDF." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "payments");
    await mkdir(uploadDir, { recursive: true });

    // Generate filename
    const ext = file.name.split(".").pop();
    const filename = `${teamId}-${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // Update database
    const fileUrl = `/uploads/payments/${filename}`;
    await prisma.team.update({
      where: { id: teamId },
      data: { paymentProofUrl: fileUrl },
    });

    return Response.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Terjadi kesalahan saat upload" },
      { status: 500 }
    );
  }
}

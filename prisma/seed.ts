import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@himatic.com" },
    update: {},
    create: {
      username: "Admin HIMATIC",
      email: "admin@himatic.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user seeded: admin@himatic.com / admin123");

  // Seed competition settings
  await prisma.competitionSetting.upsert({
    where: { competitionId: "uiux" },
    update: {},
    create: {
      competitionId: "uiux",
      label: "UI/UX Design Competition",
      maxMembers: 2,
      deadline: new Date("2026-06-30T23:59:59"),
      isOpen: true,
    },
  });

  await prisma.competitionSetting.upsert({
    where: { competitionId: "webdev" },
    update: {},
    create: {
      competitionId: "webdev",
      label: "Web Development Competition",
      maxMembers: 3,
      deadline: new Date("2026-06-30T23:59:59"),
      isOpen: true,
    },
  });
  console.log("✅ Competition settings seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

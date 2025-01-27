import { PrismaClient } from "@prisma/client";

import { adminData, roleData } from "./seeders";

const prisma = new PrismaClient();
async function seed() {
  console.log("*********Initializing Db*************");
  await prisma.$transaction([
    prisma.role.createMany({ data: roleData, skipDuplicates: true }),
    prisma.user.createMany({ data: adminData, skipDuplicates: true }),
  ]);
}

seed()
  .then(async () => {
    console.log("***********Db Initialized***********");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

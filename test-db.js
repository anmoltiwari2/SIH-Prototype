const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.workerProfile.count();
  console.log(`Worker count: ${count}`);
}

main().finally(() => prisma.$disconnect());

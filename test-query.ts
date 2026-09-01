import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const whereClause: any = {
    cumulativeRating: { gte: 0 },
  };

  const serviceFilter: any = {};
  serviceFilter.category = 'Plumbing';
  
  if (Object.keys(serviceFilter).length > 0) {
    whereClause.servicesOffered = {
      some: serviceFilter
    };
  }

  try {
    const workers = await prisma.workerProfile.findMany({
      where: whereClause,
      include: {
        servicesOffered: true,
      },
      orderBy: {
        cumulativeRating: 'desc'
      },
      take: 50
    });
    console.log("Success! Found", workers.length);
  } catch (err: any) {
    console.error("PRISMA ERROR:", err);
  }
}

main().finally(() => prisma.$disconnect());

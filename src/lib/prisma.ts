import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// Lazy instantiation to avoid build-time connection issues on Vercel
export const prisma = globalForPrisma.prisma || new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (prop === 'then') return undefined;
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    const prismaInstance = globalForPrisma.prisma as any;
    const value = prismaInstance[prop];
    return typeof value === 'function' ? value.bind(prismaInstance) : value;
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma as any;

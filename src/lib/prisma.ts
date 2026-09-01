import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { _prismaInstance: PrismaClient | undefined }

// Lazy instantiation to avoid build-time connection issues on Vercel
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (prop === 'then') return undefined;
    if (!globalForPrisma._prismaInstance) {
      globalForPrisma._prismaInstance = new PrismaClient();
    }
    const prismaInstance = globalForPrisma._prismaInstance as any;
    const value = prismaInstance[prop];
    return typeof value === 'function' ? value.bind(prismaInstance) : value;
  }
});

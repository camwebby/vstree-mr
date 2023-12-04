import { PrismaClient } from "vst-database";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: false ? ["query", "error", "warn"] : ["error"],
  });

if (false) globalForPrisma.prisma = db;

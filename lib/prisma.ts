import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  // Use var to allow reassignment in development
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// Always extend PrismaClient with withAccelerate for consistent typing
const prisma = global.prismaGlobal || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;

import { PrismaClient } from "@prisma/client";

declare  global {
  let prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
try {
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing PrismaClient...");
  }
  return new PrismaClient();
  } catch (error) {
    console.error("Failed to initialize PrismaClient:", error);
    throw error;
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal || prismaClientSingleton();

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
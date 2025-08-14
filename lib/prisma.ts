import { PrismaClient } from "../lib/generated/prisma";

declare global {
  let prisma: PrismaClient | undefined;
}

const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true";

let prisma: PrismaClient | undefined = undefined;

if (!USE_MOCK_DATA) {
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

  prisma = globalThis.prismaGlobal || prismaClientSingleton();
  if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
}

export default prisma;

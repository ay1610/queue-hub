import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma/client";

const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true";

let auth: any;

if (!USE_MOCK_DATA) {
  const prisma = new PrismaClient();
  auth = betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
    },
  });
} else {
  // Mock auth object for dev mode
  auth = {
    api: {
      async getSession() {
        return {
          user: {
            id: "mock-user-id",
            name: "Mock User",
            email: "mockuser@example.com",
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
      },
    },
  };
}

export { auth };

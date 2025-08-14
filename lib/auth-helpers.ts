import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { User } from "@/lib/generated/prisma/client";

/**
 * Mock user data for development when database is down
 */
export const mockUser: User = {
  id: "mock-user-id",
  name: "Mock User",
  email: "mockuser@example.com",
  emailVerified: true,
  image: null,
  createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
};

/**
 * Environment variable to control whether to use mock data
 * Set DEV_USE_MOCK=true in your .env.local file to use mock data
 */
const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true" || false; // Default to true for now

/**
 * Fetches the current session and user, or redirects to sign-in if not authenticated.
 * In development with DB down, returns mock user data instead.
 *
 * Usage: const user = await getProtectedUser();
 *
 * @returns {Promise<User>} The authenticated user object.
 */
export async function getProtectedUser(): Promise<User> {
  if (USE_MOCK_DATA) {
    console.log("Using mock user data for development");
    return mockUser;
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      redirect("/sign-in");
    }
    return session.user as User;
  } catch (error) {
    console.error("Auth session error:", error);
    redirect("/sign-in");
  }
}

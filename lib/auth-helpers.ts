import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { User } from "@/lib/generated/prisma/client";

/**
 * Fetches the current session and user, or redirects to sign-in if not authenticated.
 * Usage: const user = await getProtectedUser();
 *
 * @returns {Promise<User>} The authenticated user object.
 */
export async function getProtectedUser(): Promise<User> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }
  return session.user as User;
}

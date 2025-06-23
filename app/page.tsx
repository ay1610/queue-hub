/**
 * Root page: Redirects users to /home if authenticated, otherwise to /sign-in.
 * This ensures a user-friendly entry point for all visitors.
 */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/home");
  }
  redirect("/sign-in");
}

export default Page;

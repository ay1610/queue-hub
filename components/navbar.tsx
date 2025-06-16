import { BookMarked } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "../lib/auth";
import { redirect } from "next/navigation";
import ThemeToggleButton from "./theme-toggle-button";
import { ProfilePopover } from "./profile-drawer";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="border-b px-4">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
        <Link href="/" className="flex items-center gap-2">
          <BookMarked className="h-6 w-6" />
          <span className="font-bold">Queue Hub.</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          {session ? (
            <ProfilePopover
              user={{
                name: session.user?.name || "User",
                email: session.user?.email || "",
                image: session.user?.image || undefined,
              }}
              onSignOut={async () => {
                "use server";
                await auth.api.signOut({
                  headers: await headers(),
                });
                redirect("/");
              }}
            />
          ) : (
            <Link
              href="/sign-in"
              className="inline-block rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

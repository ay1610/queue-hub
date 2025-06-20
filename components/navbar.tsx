"use client";
import React from "react";
import { BookMarked } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { redirect } from "next/navigation";
import { ThemeToggleButton } from "./theme-toggle-button";
import { ProfilePopover } from "./profile-drawer";

interface User {
  name?: string;
  email?: string;
  image?: string | null;
  id?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function Navbar() {
  const [session, setSession] = useState<{ session: unknown; user: User } | null>(null);

  useEffect(() => {
    (async () => {
      const s = await authClient.getSession();
      if (s && typeof s === "object" && "data" in s && s.data) {
        const { user, session: sessionData } = s.data;
        setSession({
          session: sessionData,
          user: {
            ...user,
            createdAt: user.createdAt ? user.createdAt.toString() : undefined,
            updatedAt: user.updatedAt ? user.updatedAt.toString() : undefined,
          },
        });
      } else {
        setSession(null);
      }
    })();
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null); // Immediately clear session on sign out
    redirect("/");
  };

  return (
    <div className="border-b px-4">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
        <Link href="/" className="flex items-center gap-2">
          <BookMarked className="h-6 w-6" />
          <span className="font-bold">Queue Hub.</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          {session && session.user ? (
            <ProfilePopover
              user={{
                name: session.user.name || "User",
                email: session.user.email || "",
                image: session.user.image || undefined,
              }}
              onSignOut={handleSignOut}
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

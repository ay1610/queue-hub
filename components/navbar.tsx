"use client";
import React, { useState, useEffect } from "react";
import { BookMarked, Menu, Settings as CogIcon, Film, Tv, Bookmark, User } from "lucide-react";
import Link from "next/link";
import { authClient } from "../lib/auth-client";
import { redirect } from "next/navigation";
import { SettingsMenu } from "./SettingsMenu";
import { ProfilePopover } from "./profile-drawer";
import { SearchBar } from "@/components/search/SearchBar";
import { Drawer } from "vaul";


export default function Navbar() {
  interface User {
    name?: string;
    email?: string;
    image?: string | null;
    id?: string;
    emailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  const [session, setSession] = useState<{ session: unknown; user: User } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // The navbar uses a solid background and high z-index to ensure the global GridBg does not show through.
  // This preserves visual separation and clarity per design requirements.
  return (
    <div className="border-b px-4 bg-background z-30 relative">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 flex-1">
          <Link href="/" className="flex items-center gap-2">
            <BookMarked className="h-6 w-6" />
            <span className="font-bold">Queue Hub.</span>
          </Link>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center">
            <Link href="/trending/movies" className="font-medium ml-4">
              Trending Movies
            </Link>
            <Link href="/trending/tv-server" className="font-medium ml-2">
              Trending TV
            </Link>
            <Link href="/watch-list" className="font-medium ml-2">
              Watch List
            </Link>
          </div>
        </div>
        {/* Right: SearchBar always visible, Settings/Profile/Hamburger */}
        <div className="flex items-center gap-4">
          <SearchBar />
          <div className="hidden md:flex items-center gap-4">
            <SettingsMenu />
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
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Mobile Drawer */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content className="fixed top-0 right-0 h-full w-96 bg-background shadow-lg z-50 p-6 rounded-none">
            <div className="flex flex-col gap-6 h-full">
              <div className="flex flex-col gap-4">
                <Link href="/trending/movies" className="flex items-center gap-2 font-medium" onClick={() => setDrawerOpen(false)}>
                  <Film className="h-5 w-5" />
                  Trending Movies
                </Link>
                <Link href="/trending/tv-server" className="flex items-center gap-2 font-medium" onClick={() => setDrawerOpen(false)}>
                  <Tv className="h-5 w-5" />
                  Trending TV
                </Link>
                <Link href="/watch-list" className="flex items-center gap-2 font-medium" onClick={() => setDrawerOpen(false)}>
                  <Bookmark className="h-5 w-5" />
                  Watch List
                </Link>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <SettingsMenu />
              </div>

              {session && session.user ? (
                <ProfilePopover
                  user={{
                    name: session.user.name || "User",
                    email: session.user.email || "",
                    image: session.user.image || undefined,
                  }}
                  onSignOut={() => {
                    handleSignOut();
                    setDrawerOpen(false);
                  }}
                />
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => setDrawerOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Sign In
                </Link>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { BookMarked, Menu, Film, Tv, Bookmark, User, X } from "lucide-react";
import Link from "next/link";
import { authClient } from "../lib/auth-client";
// Using window.location for client-side redirect to avoid test env router issues
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
  // no router hook needed

  useEffect(() => {
    (async () => {
      try {
        const s = await authClient.getSession();
        type SessionResponse = { data?: { user: Record<string, unknown>; session: unknown } } | null | undefined;
        const res = s as SessionResponse;
        if (res && typeof res === "object" && "data" in res && res.data) {
          const { user: rawUser, session: sessionData } = res.data;
          const user = rawUser as Partial<User> & { createdAt?: Date | string; updatedAt?: Date | string };
          setSession({
            session: sessionData,
            user: {
              ...user,
              createdAt: user?.createdAt ? user.createdAt.toString() : undefined,
              updatedAt: user?.updatedAt ? user.updatedAt.toString() : undefined,
            },
          });
        } else {
          setSession(null);
        }
      } catch {
        // Swallow fetch errors to keep navbar resilient
        setSession(null);
      }
    })();
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null); // Immediately clear session on sign out
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
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
            className="md:hidden p-3 rounded-full bg-muted hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>
      {/* Mobile Drawer */}
      {/*
        Z-INDEX LAYERING SYSTEM:
        --z-drawer-overlay: 100; // Drawer overlay, sits below drawer content
        --z-drawer-content: 101; // Drawer content, must be above overlay and below select dropdown
        See globals.css for variable definitions. Adjust as needed for global consistency.
      */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen} shouldScaleBackground={false}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[var(--z-drawer-overlay,100)]" />
          <Drawer.Content
            className="fixed top-0 right-0 h-full w-[75%] max-w-xs bg-background shadow-lg z-[var(--z-drawer-content,101)] p-6"
            id="mobile-menu"
            aria-label="Mobile navigation menu"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col gap-6 h-full">
              {/* Drawer header with close button */}
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  className="p-2 rounded-full hover:bg-muted"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Scrollable content area */}
              <div
                className="flex-1 overflow-y-auto"
                role="region"
                aria-label="Scrollable navigation links"
              >
                <div className="flex flex-col gap-4 mb-4">
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

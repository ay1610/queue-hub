"use client";
import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ProfilePopover({
  user,
  onSignOut,
}: {
  user: { name: string; email: string; image?: string };
  onSignOut: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open profile">
          <Avatar src={user.image} alt={user.name} fallback={user.name?.[0] || "U"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 flex flex-col items-center gap-3 rounded-xl border bg-white dark:bg-zinc-900 shadow-xl">
        <Avatar
          src={user.image}
          alt={user.name}
          fallback={user.name?.[0] || "U"}
          className="h-14 w-14 text-zinc-400 mb-2"
        />
        <div className="font-semibold text-lg">{user.name}</div>
        <div className="text-sm text-zinc-500 mb-2">{user.email}</div>
        <a
          href="/account"
          className="text-xs text-blue-600 hover:underline mb-2"
        >
          Manage account
        </a>
        <Button variant="destructive" onClick={onSignOut} className="w-full mt-2">
          Sign Out
        </Button>
      </PopoverContent>
    </Popover>
  );
}

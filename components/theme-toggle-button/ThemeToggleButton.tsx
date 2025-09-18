"use client";
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
// Removed unused Tooltip imports
import { useTheme } from "next-themes";

export function ThemeToggleButton() {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (t: string) => theme === t || (t === "system" && theme === "system");

  return (
    <div className="w-full max-w-xs mx-auto bg-popover border border-border rounded-xl shadow-lg p-5">
      <div className="mb-3 text-sm font-semibold text-muted-foreground">Theme</div>
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base justify-start ${isActive("light") ? "bg-muted font-semibold" : "hover:bg-muted"}`}
          aria-label="Switch to light mode"
          onClick={() => setTheme("light")}
        >
          <span className="flex items-center justify-center h-5 w-5">
            <Sun className={`h-5 w-5 ${isActive("light") ? "text-yellow-400" : "text-muted-foreground"}`} />
          </span>
          <span className="flex-1 text-left">Light</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base justify-start ${isActive("dark") ? "bg-muted font-semibold" : "hover:bg-muted"}`}
          aria-label="Switch to dark mode"
          onClick={() => setTheme("dark")}
        >
          <span className="flex items-center justify-center h-5 w-5">
            <Moon className={`h-5 w-5 ${isActive("dark") ? "text-blue-500" : "text-muted-foreground"}`} />
          </span>
          <span className="flex-1 text-left">Dark</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base justify-start ${isActive("system") ? "bg-muted font-semibold" : "hover:bg-muted"}`}
          aria-label="Switch to system theme"
          onClick={() => setTheme("system")}
        >
          <span className="flex items-center justify-center h-5 w-5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" /><path d="M10 5v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </span>
          <span className="flex-1 text-left">System</span>
          <span className="ml-2 text-xs text-muted-foreground">
            {systemTheme ? `(${systemTheme.charAt(0).toUpperCase() + systemTheme.slice(1)})` : ""}
          </span>
        </Button>
      </div>
    </div>
  );
}

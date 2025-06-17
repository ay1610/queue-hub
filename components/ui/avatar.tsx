"use client";
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 items-center justify-center",
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || "Avatar"}
          className="object-cover"
          fill
          // 'sizes' is not needed when using 'fill', as layout is determined by parent
        />
      ) : fallback ? (
        fallback
      ) : (
        <span className="text-zinc-500 text-lg font-bold">?</span>
      )}
    </div>
  )
);
Avatar.displayName = "Avatar";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * SearchResultSkeleton component displays a loading skeleton for search results.
 * It mimics the layout of MediaCard components while data is being fetched.
 */
export function SearchResultSkeleton() {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 justify-center")}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          // Matched classNames from MediaCard
          className={cn(
            "bg-white dark:bg-zinc-900 rounded shadow p-2 flex flex-col items-center relative"
          )}
        >
          <div className="relative w-full flex justify-center">
            {/* Matched aspect ratio and margin from MediaCard Image */}
            <Skeleton className="rounded mb-2 w-full aspect-[2/3]" />
            {/* Matched position and size from MediaRatingBadge */}
            <div className="absolute bottom-2 left-2 z-10">
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </div>
          {/* Matched container classNames */}
          <div className={cn("text-center mt-2 w-full")}>
            {/* Approximates two lines of text-base font */}
            <Skeleton className="h-10 w-5/6 mb-1 mx-auto" />
            {/* Approximates one line of text-xs font */}
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

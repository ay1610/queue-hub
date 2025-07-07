import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * TVShowSkeleton component displays a loading skeleton for trending TV shows.
 * It shows both a hero skeleton and a grid of show card skeletons.
 */
export function TVShowSkeleton() {
  return (
    <>
      {/* Hero section skeleton - matches MediaHero layout */}
      <section className="relative w-[85vw] min-h-[60vh] h-[60vw] max-h-[700px] flex items-end overflow-hidden bg-black px-8 md:px-16 lg:px-24 py-8 md:py-16 lg:py-24 mx-auto">
        <Skeleton className="absolute inset-0" /> {/* Backdrop */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />{" "}
        {/* Gradient overlay */}
        <div className="relative z-20 max-w-4xl w-full flex flex-col items-center justify-center text-center mx-auto">
          <Skeleton className="h-12 md:h-14 lg:h-16 w-2/3 max-w-lg mb-4 mx-auto" /> {/* Title */}
          <Skeleton className="h-6 w-full max-w-2xl mb-2 mx-auto" /> {/* Overview line 1 */}
          <Skeleton className="h-6 w-4/5 max-w-xl mb-2 mx-auto" /> {/* Overview line 2 */}
          <Skeleton className="h-6 w-3/5 max-w-lg mb-6 mx-auto" /> {/* Overview line 3 */}
          <Skeleton className="h-8 w-24 rounded-md mx-auto" /> {/* Button */}
        </div>
      </section>

      {/* Grid section title skeleton */}
      <div className="w-[85vw] mx-auto mb-6">
        <Skeleton className="h-8 w-56 mx-auto" /> {/* Section title */}
      </div>

      {/* Grid of TV show cards */}
      <div className={cn("w-[85vw] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 justify-center")}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "bg-white dark:bg-zinc-900 rounded shadow p-2 flex flex-col items-center relative"
            )}
          >
            <div className="relative w-full flex justify-center">
              <Skeleton className="rounded mb-2 w-full aspect-[2/3]" /> {/* Poster */}
              <div className="absolute bottom-2 left-2 z-10">
                <Skeleton className="h-6 w-12 rounded-full" /> {/* Rating badge */}
              </div>
            </div>
            <div className={cn("text-center mt-2 w-full")}>
              <Skeleton className="h-10 w-5/6 mb-1 mx-auto" /> {/* Title */}
              <Skeleton className="h-4 w-1/2 mx-auto" /> {/* Year */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

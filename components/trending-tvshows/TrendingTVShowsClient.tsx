"use client";

import React, { useEffect, useMemo } from "react";
// import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useGridVirtualization } from "@/components/media/useGridVirtualization";
import type { JSX } from "react";
import { cn } from "@/lib/utils";
import { useInfiniteTrendingTVShows } from "@/lib/tmdb/tv/hooks";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";
import { useAggregatedMediaDataBatch } from "@/components/media/useAggregatedMediaDataBatch";
import { useHeroItem } from "@/components/media/useHeroItem";

import { TVShowHero } from "./TVShowHero";
import { TVShowSkeleton } from "./TVShowSkeleton";
import type { TMDBTVShow } from "@/lib/types/tmdb";
import { MediaCardShadcn } from "../media-card/MediaCardShadcn";

/**
 * Client-side component that fetches trending TV shows and watch later list using React Query,
 * then displays a hero section for a random show followed by a grid of trending TV show cards.
 */
export function TrendingTVShowsClient(): JSX.Element {
  // Infinite query for trending TV shows
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTrendingTVShows();
  const watchLaterLookup = useWatchLaterLookup();

  // Combine all shows from all pages
  const allShows: TMDBTVShow[] = data?.pages.flatMap((page) => page.results) ?? [];

  // Use new hook for data aggregation
  const { showDataMap } = useAggregatedMediaDataBatch("tv", allShows);

  // Use new hook for hero show selection
  const heroShow = useHeroItem(data?.pages?.[0]?.results ?? []);

  // Virtualizer setup (declare only once)
  // Grid virtualization: virtualize rows, each with up to 4 cards
  const CARDS_PER_ROW = 4;
  const ROW_HEIGHT = 700;
  const { virtualizer, virtualRows, rowCount } = useGridVirtualization({
    media: allShows,
    cardsPerRow: CARDS_PER_ROW,
    rowHeight: ROW_HEIGHT,
  });

  // Infinite scroll: prefetch next page when 5 rows from the end
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (virtualRows.length) {
      const lastRow = virtualRows[virtualRows.length - 1];
      if (lastRow.index >= rowCount - 5) {
        fetchNextPage();
      }
    }
  }, [virtualRows, hasNextPage, isFetchingNextPage, fetchNextPage, rowCount]);

  if (isLoading) {
    return <TVShowSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-500">Failed to load trending TV shows</div>
      </div>
    );
  }

  if (!allShows.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">No trending TV shows found</div>
      </div>
    );
  }

  return (
    <>
      {heroShow && <TVShowHero show={heroShow} />}
      <section className={cn("w-[85vw] mt-8 mx-auto")} aria-label="Trending TV Shows Section">
        <h2 className={cn("text-2xl font-bold mb-4 text-center")}>Trending TV Shows</h2>
        <div className="relative w-full bg-transparent" aria-label="Trending TV Shows Grid">
          <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualRows.map((virtualRow) => {
              const rowStart = virtualRow.index * CARDS_PER_ROW;
              const rowEnd = Math.min(rowStart + CARDS_PER_ROW, allShows.length);
              return (
                <div
                  key={virtualRow.index}
                  ref={(el) => virtualizer.measureElement(el)}
                  data-index={virtualRow.index}
                  className="absolute top-0 left-0 w-full flex justify-center"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-2")}>
                    {/* Responsive grid */}
                    {allShows.slice(rowStart, rowEnd).map((show) => {
                      const isInWatchLater = watchLaterLookup[`${show.id}-tv`] || false;
                      const aggregated = showDataMap.get(show.id);
                      return (
                        <MediaCardShadcn
                          key={show.id}
                          media={show}
                          type="tv"
                          isInWatchLater={isInWatchLater}
                          runtime={aggregated?.runtime}
                          rating={aggregated?.rating}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {isFetchingNextPage && (
            <div className="w-full flex flex-col items-center absolute bottom-0 left-0">
              <TVShowSkeleton showHero={false} />
              <span className="text-gray-500 mt-2">Loading more...</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

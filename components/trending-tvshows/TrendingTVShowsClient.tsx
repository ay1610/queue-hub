"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { JSX } from "react";
import { cn, getRandomItems } from "@/lib/utils";
import { useInfiniteTrendingTVShows } from "@/lib/tmdb/tv/hooks";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";
import { useBatchExternalIds } from "@/components/media/useBatchExternalIds";
import { useBatchRuntime } from "@/components/media/useBatchRuntime";
import { useBatchRatings } from "@/components/media/useBatchRatings";
import { useAggregatedMediaData } from "@/components/media/useAggregatedMediaData";

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

  // Step 1: Fetch all external IDs for visible shows in a single batch (media-agnostic)
  const tmdbIds = allShows.map((show) => show.id);
  const { data: externalIdsBatch } = useBatchExternalIds("tv", tmdbIds);
  const imdbIds = (externalIdsBatch ?? [])
    .map((ext: { imdb_id?: string | null }) => ext?.imdb_id)
    .filter((id: string | null | undefined): id is string => !!id);
  const { data: runtimeBatch } = useBatchRuntime(imdbIds);
  const { data: ratingBatch } = useBatchRatings(imdbIds);
  const showDataMap = useAggregatedMediaData(allShows, externalIdsBatch, runtimeBatch, ratingBatch);

  // Pick a hero show from the first page
  const [heroShow, setHeroShow] = useState<TMDBTVShow | null>(null);
  useEffect(() => {
    if (data?.pages?.[0]?.results?.length && !heroShow) {
      const firstPageShows = data.pages[0].results;
      const [randomTVShow] = getRandomItems(firstPageShows, 1);
      setHeroShow(randomTVShow);
    }
  }, [data, heroShow]);

  // Virtualizer setup (declare only once)
  // Grid virtualization: virtualize rows, each with up to 4 cards
  const CARDS_PER_ROW = 4;
  const ROW_HEIGHT = 700; // fallback estimate, but will use dynamic measurement
  const rowCount = useMemo(() => Math.ceil(allShows.length / CARDS_PER_ROW), [allShows.length]);
  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
    // measureElement is handled by ref below
  });
  const virtualRows = virtualizer.getVirtualItems();

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
  <section className={cn("w-[85vw] mt-2 mx-auto")} aria-label="Trending TV Shows Section">
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

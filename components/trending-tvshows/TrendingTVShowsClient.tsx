"use client";

import React, { useState, useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { JSX } from "react";
import { cn, getRandomItems } from "@/lib/utils";
import { useInfiniteTrendingTVShows } from "@/lib/tmdb/tv/hooks";
// Switch to Zustand-backed selector for minimal re-renders
import { InteractiveWatchLaterCard } from "../media-card/WatchLaterAwareCard";
import { useBatchExternalIds } from "@/components/media/useBatchExternalIds";
import { useBatchRuntime } from "@/components/media/useBatchRuntime";
import { useBatchRatings } from "@/components/media/useBatchRatings";
import { useAggregatedMediaData } from "@/components/media/useAggregatedMediaData";

import { TVShowHero } from "./TVShowHero";
// Types are inferred through aggregated result; no direct references needed here
import { TVShowSkeleton } from "./TVShowSkeleton";
import type { TMDBTVShow } from "@/lib/types/tmdb";
import { CARD_ROW_GAP_DESKTOP, CARD_ROW_GAP_MOBILE, estimateCardBlockSize } from "@/lib/ui/layout";

const getCardsPerRow = () => {
  if (typeof window === "undefined") return 4; // Default for SSR
  if (window.innerWidth >= 1280) return 5;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 3;
  return 2;
};

/**
 * Client-side component that fetches trending TV shows and watch later list using React Query,
 * then displays a hero section for a random show followed by a grid of trending TV show cards.
 */
export function TrendingTVShowsClient(): JSX.Element {
  const [heroShow, setHeroShow] = useState<TMDBTVShow | null>(null);
  const [cardsPerRow, setCardsPerRow] = useState(getCardsPerRow());

  // Infinite query for trending TV shows
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTrendingTVShows();

  // Combine all shows from all pages (memoized)
  const allShows: TMDBTVShow[] = React.useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  // Step 1: Fetch all external IDs for visible shows in a single batch (media-agnostic, memoized)
  const tmdbIds = React.useMemo(() => allShows.map((show) => show.id), [allShows]);
  const { data: externalIdsBatch } = useBatchExternalIds("tv", tmdbIds);
  const imdbIds = (externalIdsBatch ?? [])
    .map((ext: { imdb_id?: string | null }) => ext?.imdb_id)
    .filter((id: string | null | undefined): id is string => !!id);
  const { data: runtimeBatch } = useBatchRuntime(imdbIds);
  const { data: ratingBatch } = useBatchRatings(imdbIds);
  const showDataMap = useAggregatedMediaData(allShows, externalIdsBatch, runtimeBatch, ratingBatch);

  useEffect(() => {
    if (data?.pages?.[0]?.results?.length && !heroShow) {
      const firstPageShows = data.pages[0].results;
      const [randomTVShow] = getRandomItems(firstPageShows, 1);
      setHeroShow(randomTVShow);
    }
  }, [data, heroShow]);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerRow(getCardsPerRow());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive gap & uniform card height (shared with movies list)
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 640;
  const rowGap = isDesktop ? CARD_ROW_GAP_DESKTOP : CARD_ROW_GAP_MOBILE;
  const estimate = estimateCardBlockSize(isDesktop);

  const virtualizer = useWindowVirtualizer({
    count: allShows.length,
    estimateSize: () => estimate, // Responsive estimate
    overscan: 5,
    gap: rowGap, // Responsive gap
    lanes: cardsPerRow,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Infinite scroll: prefetch next page when the last item is visible
  useEffect(() => {
    if (!virtualItems.length || !hasNextPage || isFetchingNextPage) {
      return;
    }
    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= allShows.length - 1 - cardsPerRow * 2) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allShows.length,
    isFetchingNextPage,
    virtualItems,
    cardsPerRow,
  ]);

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

  // Use shared wrapper instead of inline definition

  return (
    <>
      {heroShow && <TVShowHero show={heroShow} />}
      <section className={cn("w-[85vw] mt-2 sm:mt-6 mx-auto")} aria-label="Trending TV Shows Section">
        <h2 className={cn("text-2xl font-bold mb-2 sm:mb-4 text-center")}>Trending TV Shows</h2>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualItem) => {
            const show = allShows[virtualItem.index];
            const aggregated = showDataMap.get(show.id);

            return (
              <div
                key={virtualItem.key}
                ref={virtualizer.measureElement}
                data-index={virtualItem.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${(virtualItem.lane * 100) / cardsPerRow}%`,
                  width: `${100 / cardsPerRow}%`,
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                  padding: "0.5rem",
                }}
              >
                <InteractiveWatchLaterCard
                  media={show}
                  type="tv"
                  runtime={aggregated?.runtime}
                  rating={aggregated?.rating}
                />
              </div>
            );
          })}
        </div>
        {isFetchingNextPage && (
          <div className="text-center col-span-full py-4">Loading more...</div>
        )}
      </section>
    </>
  );
}

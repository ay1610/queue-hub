"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { JSX } from "react";

import { useAggregatedMediaData } from "@/components/media/useAggregatedMediaData";
import { CARD_ROW_GAP_DESKTOP, CARD_ROW_GAP_MOBILE, estimateCardBlockSize } from "@/lib/ui/layout";
import { useBatchExternalIds } from "@/components/media/useBatchExternalIds";
import { useBatchRatings } from "@/components/media/useBatchRatings";
import { useBatchRuntime } from "@/components/media/useBatchRuntime";
import { useInfiniteTrendingMovies } from "@/lib/tmdb/movie/hooks";
import type { TMDBMovie } from "@/lib/types/tmdb";
import { cn, getRandomItems } from "@/lib/utils";
// Removed inline watch-later hook usage; handled inside WatchLaterAwareCard

// import { MediaCardShadcn } from "../media-card/MediaCardShadcn";
import { TVShowSkeleton } from "../trending-tvshows/TVShowSkeleton";
import { MovieHero } from "./MovieHero";
import { InteractiveWatchLaterCard } from "../media-card/WatchLaterAwareCard";

const getCardsPerRow = () => {
  if (typeof window === "undefined") return 4; // Default for SSR
  if (window.innerWidth >= 1280) return 5;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 3;
  return 2;
};

/**
 * Client-side component that fetches trending movies and watch later list using React Query,
 * then displays a hero section for a random movie followed by a grid of trending movie cards.
 */
export function TrendingMoviesClient(): JSX.Element {
  const [heroMovie, setHeroMovie] = useState<TMDBMovie | null>(null);
  const [cardsPerRow, setCardsPerRow] = useState(getCardsPerRow());

  // Infinite query for trending movies
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTrendingMovies();
  // Use shared wrapper instead of inline definition

  // Combine all movies from all pages
  const allMovies: TMDBMovie[] = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  // Step 1: Fetch all external IDs for visible movies in a single batch (media-agnostic)
  const tmdbIds = useMemo(() => allMovies.map((movie) => movie.id), [allMovies]);
  const { data: externalIdsBatch } = useBatchExternalIds("movie", tmdbIds);
  const imdbIds = (externalIdsBatch ?? [])
    .map((ext: { imdb_id?: string | null }) => ext?.imdb_id)
    .filter((id: string | null | undefined): id is string => !!id);
  const { data: runtimeBatch } = useBatchRuntime(imdbIds);
  const { data: ratingBatch } = useBatchRatings(imdbIds);
  const movieDataMap = useAggregatedMediaData(
    allMovies,
    externalIdsBatch,
    runtimeBatch,
    ratingBatch
  );

  useEffect(() => {
    if (data?.pages?.[0]?.results?.length && !heroMovie) {
      const firstPageMovies = data.pages[0].results;
      const [randomMovie] = getRandomItems(firstPageMovies, 1);
      setHeroMovie(randomMovie);
    }
  }, [data, heroMovie]);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerRow(getCardsPerRow());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive gap and estimate for desktop vs mobile
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 640;
  // Increase vertical spacing between rows (previous gap too tight). Use larger gap on all breakpoints.
  const rowGap = isDesktop ? CARD_ROW_GAP_DESKTOP : CARD_ROW_GAP_MOBILE;
  // Estimate fixed card height + gap (values centralized in layout constants)
  const estimate = estimateCardBlockSize(isDesktop);

  const virtualizer = useWindowVirtualizer({
    count: allMovies.length,
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
    if (lastItem.index >= allMovies.length - 1 - cardsPerRow * 2) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allMovies.length,
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
        <div className="text-lg text-red-500">Failed to load trending movies</div>
      </div>
    );
  }

  if (!allMovies.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">No trending movies found</div>
      </div>
    );
  }

  return (
    <>
      {heroMovie && <MovieHero movie={heroMovie} />}
      <section
        className={cn(
          "w-[85vw] px-2 sm:px-4 md:px-6 lg:px-8 mx-auto my-2 sm:my-6"
        )}
        aria-label="Trending Movies Section"
      >
        <h2 className={cn("text-2xl font-bold text-center mb-2 sm:mb-4")}>
          Trending Movies
        </h2>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualItem) => {
            const movie = allMovies[virtualItem.index];
            const aggregated = movieDataMap.get(movie.id);

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
                  padding: isDesktop ? "0.5rem" : "0.25rem", // Smaller padding on mobile
                }}
              >
                <InteractiveWatchLaterCard
                  media={movie}
                  type="movie"
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

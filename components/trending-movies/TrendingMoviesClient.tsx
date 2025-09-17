"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { JSX } from "react";

import { useAggregatedMediaData } from "@/components/media/useAggregatedMediaData";
import { useBatchExternalIds } from "@/components/media/useBatchExternalIds";
import { useBatchRatings } from "@/components/media/useBatchRatings";
import { useBatchRuntime } from "@/components/media/useBatchRuntime";
import { useInfiniteTrendingMovies } from "@/lib/tmdb/movie/hooks";
import type { TMDBMovie } from "@/lib/types/tmdb";
import { cn, getRandomItems } from "@/lib/utils";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";

import { MediaCardShadcn } from "../media-card/MediaCardShadcn";
import { TVShowSkeleton } from "../trending-tvshows/TVShowSkeleton";
import { MovieHero } from "./MovieHero";

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
  const watchLaterLookup = useWatchLaterLookup();

  // Combine all movies from all pages
  const allMovies: TMDBMovie[] = data?.pages.flatMap((page) => page.results) ?? [];

  // Step 1: Fetch all external IDs for visible movies in a single batch (media-agnostic)
  const tmdbIds = allMovies.map((movie) => movie.id);
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

  // Virtualizer setup for a grid layout
  const virtualizer = useWindowVirtualizer({
    count: allMovies.length,
    estimateSize: () => 450 + 48, // Estimate height of a card row + gap
    overscan: 5,
    gap: 48, // 3rem = 48px
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
          "w-[85vw] px-2 sm:px-4 md:px-6 lg:px-8 mx-auto my-4 sm:my-6"
        )}
        aria-label="Trending Movies Section"
      >
        <h2 className={cn("text-2xl font-bold text-center mb-4 sm:mb-6")}>
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
            const isInWatchLater =
              watchLaterLookup[`${movie.id}-movie`] || false;
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
                  padding: "0.5rem",
                }}
              >
                <MediaCardShadcn
                  media={movie}
                  type="movie"
                  isInWatchLater={isInWatchLater}
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

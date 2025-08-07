"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { JSX } from "react";
import { cn, getRandomItems } from "@/lib/utils";
import { useInfiniteTrendingMovies } from "@/lib/tmdb/movie/hooks";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";
import { useBatchExternalIds } from "@/components/media/useBatchExternalIds";
import { useBatchRuntime } from "@/components/media/useBatchRuntime";
import { useBatchRatings } from "@/components/media/useBatchRatings";
import { useAggregatedMediaData } from "@/components/media/useAggregatedMediaData";
import { MovieHero } from "./MovieHero";
import type { TMDBMovie } from "@/lib/types/tmdb";
import { MediaCardShadcn } from "../media-card/MediaCardShadcn";

/**
 * Client-side component that fetches trending movies and watch later list using React Query,
 * then displays a hero section for a random movie followed by a grid of trending movie cards.
 */
export function TrendingMoviesClient(): JSX.Element {
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

  // Pick a hero movie from the first page
  const [heroMovie, setHeroMovie] = useState<TMDBMovie | null>(null);
  useEffect(() => {
    if (data?.pages?.[0]?.results?.length && !heroMovie) {
      const firstPageMovies = data.pages[0].results;
      const [randomMovie] = getRandomItems(firstPageMovies, 1);
      setHeroMovie(randomMovie);
    }
  }, [data, heroMovie]);

  // Virtualizer setup (declare only once)
  // Grid virtualization: virtualize rows, each with up to 4 cards
  const CARDS_PER_ROW = 4;
  const ROW_HEIGHT = 700; // fallback estimate, but will use dynamic measurement
  const rowCount = useMemo(() => Math.ceil(allMovies.length / CARDS_PER_ROW), [allMovies.length]);
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
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading trending movies...</div>
      </div>
    );
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
      <section className={cn("w-[85vw] mt-8 mx-auto")} aria-label="Trending Movies Section">
        <h2 className={cn("text-2xl font-bold mb-4 text-center")}>Trending Movies</h2>
        <div className="relative w-full bg-transparent" aria-label="Trending Movies Grid">
          <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualRows.map((virtualRow) => {
              const rowStart = virtualRow.index * CARDS_PER_ROW;
              const rowEnd = Math.min(rowStart + CARDS_PER_ROW, allMovies.length);
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
                    {allMovies.slice(rowStart, rowEnd).map((movie) => {
                      const isInWatchLater = watchLaterLookup[`${movie.id}-movie`] || false;
                      const aggregated = movieDataMap.get(movie.id);
                      return (
                        <MediaCardShadcn
                          key={movie.id}
                          media={movie}
                          type="movie"
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
              <span className="text-gray-500 mt-2">Loading more...</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

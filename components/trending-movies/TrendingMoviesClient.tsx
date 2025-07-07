"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { JSX } from "react";
import { cn, getRandomItems } from "@/lib/utils";
import { MediaCard } from "@/components/media-card/MediaCard";
import { useTrendingMovies } from "@/lib/tmdb/movie/hooks";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";
import { MovieHero } from "./MovieHero";
import type { TMDBMovie } from "@/lib/types/tmdb";

/**
 * Client-side component that fetches trending movies and watch later list using React Query,
 * then displays a hero section for a random movie followed by a grid of trending movie cards.
 */
export function TrendingMoviesClient(): JSX.Element {
  const [heroMovie, setHeroMovie] = useState<TMDBMovie | null>(null);
  const { data: trendingData, isLoading, error } = useTrendingMovies(1);
  const watchLaterLookup = useWatchLaterLookup();

  const movies = useMemo(() => trendingData?.results || [], [trendingData?.results]);

  // Set hero movie when data is available
  useEffect(() => {
    if (movies.length > 0 && !heroMovie) {
      const [randomMovie] = getRandomItems(movies, 1);
      setHeroMovie(randomMovie);
    }
  }, [movies, heroMovie]);

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

  if (!movies.length) {
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
        <div
          className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 justify-center")}
          aria-label="Trending Movies Grid"
        >
          {movies.map((movie) => {
            const isInWatchLater = watchLaterLookup[`${movie.id}-movie`] || false;
            return (
              <MediaCard
                key={movie.id}
                media={movie}
                type="movie"
                isInWatchLater={isInWatchLater}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}

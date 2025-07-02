import React from "react";
import type { JSX } from "react";
import { cn } from "@/lib/utils";
import { MediaCard } from "@/components/media-card/MediaCard";
import { getTrendingMovies } from "@/lib/tmdb/movie/client";
import { MovieHero } from "./MovieHero";

/**
 * Fetches trending movies and displays a hero section for a random movie,
 * followed by a grid of trending movie cards.
 *
 * @returns A React fragment with a hero and trending movies grid, or null if no data.
 */
export async function TrendingMovies(): Promise<JSX.Element | null> {
  const data = await getTrendingMovies(1);
  if (!data || !data.results.length) return null;

  // Pick a random movie for the hero
  const randomIndex = Math.floor(Math.random() * data.results.length);
  const heroMovie = data.results[randomIndex];

  return (
    <>
      <MovieHero movie={heroMovie} />
      <section className={cn("w-[85vw] mt-8 mx-auto")} aria-label="Trending Movies Section">
        <h2 className={cn("text-2xl font-bold mb-4 text-center")}>Trending Movies</h2>
        <div
          className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 justify-center")}
          aria-label="Trending Movies Grid"
        >
          {data.results.map((movie) => (
            <MediaCard key={movie.id} media={movie} type="movie" />
          ))}
        </div>
      </section>
    </>
  );
}

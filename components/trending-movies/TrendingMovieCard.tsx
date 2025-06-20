"use client";

import React from "react";
import type { TMDBMovie } from "@/lib/tmdb/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/tmdb/utils";

/**
 * TrendingMovieCard displays a single trending movie with its poster and details.
 * @param movie - The TMDBMovie object containing movie details.
 */
export function TrendingMovieCard({ movie }: { movie: TMDBMovie }) {
  return (
    <div
      className={cn("bg-white dark:bg-zinc-900 rounded shadow p-2 flex flex-col items-center")}
      aria-label={`Movie card for ${movie.title}`}
    >
      {movie.poster_path ? (
        <Image
          src={getImageUrl(movie.poster_path, "w185")}
          alt={`Poster for ${movie.title}`}
          width={185}
          height={278}
          className={cn("rounded mb-2 w-full h-auto")}
        />
      ) : (
        <div
          className={cn("w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500")}
        >
          <span className={cn("block text-xs text-gray-400")}>No Image</span>
        </div>
      )}
      <div
        className={cn("text-center mt-2")}
        aria-label={`Movie title and release date for ${movie.title}`}
      >
        <div className={cn("font-semibold text-sm text-gray-900 dark:text-white drop-shadow-md")}>
          {movie.title}
        </div>
        <div className={cn("text-xs text-gray-500 dark:text-gray-400")}>{movie.release_date}</div>
      </div>
    </div>
  );
}

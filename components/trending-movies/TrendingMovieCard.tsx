"use client";

import React from "react";
import type { TMDBMovie } from "@/lib/tmdb/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/tmdb/utils";
import { MediaRatingBadge } from "../media-rating-badge";
import Link from "next/link";

/**
 * TrendingMovieCard displays a single trending movie with its poster and details.
 * Now links to the movie detail page.
 * @param movie - The TMDBMovie object containing movie details.
 */
export function TrendingMovieCard({ movie }: { movie: TMDBMovie }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded shadow p-2 flex flex-col items-center relative hover:ring-2 hover:ring-primary transition-all duration-150"
      )}
      aria-label={`Movie card for ${movie.title}`}
      prefetch={false}
    >
      <div className="relative w-full flex justify-center">
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
        {/* Out of 10 badge at bottom left over the poster */}
        <div className="absolute bottom-2 left-2 z-10">
          <MediaRatingBadge voteAverage={movie.vote_average} size="sm" />
        </div>
      </div>
      <div
        className={cn("text-center mt-2")}
        aria-label={`Movie title and release date for ${movie.title}`}
      >
        <div className={cn("font-semibold text-sm text-gray-900 dark:text-white drop-shadow-md")}>
          {movie.title}
        </div>
        <div className={cn("text-xs text-gray-500 dark:text-gray-400")}>{movie.release_date}</div>
      </div>
    </Link>
  );
}

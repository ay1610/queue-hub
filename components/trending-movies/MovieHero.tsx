"use client";

import React from "react";
import type { TMDBMovie } from "@/lib/tmdb/types";
import Image from "next/image";
import { getBackdropUrl } from "@/lib/tmdb/utils";
import { MediaRatingBadge } from "@/components/media-rating-badge";

/**
 * MovieHero displays a full-bleed hero section for a single movie, inspired by oktay/movies.
 * @param movie - The TMDBMovie object to feature.
 */
export function MovieHero({ movie }: { movie: TMDBMovie }) {
  if (!movie) return null;
  const backdropUrl = getBackdropUrl(movie.backdrop_path, "w1280");

  return (
    <section
      className="relative w-full min-h-[60vh] h-[60vw] max-h-[700px] flex items-end overflow-hidden bg-black px-8 md:px-16 lg:px-24 py-8 md:py-16 lg:py-24"
      aria-label={`Hero section for ${movie.title}`}
    >
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={`Backdrop for ${movie.title}`}
          fill
          className="object-cover object-center w-full h-full absolute inset-0 z-0 rounded-lg"
          priority
        />
      )}
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      <div className="relative z-20 max-w-4xl w-full flex flex-col items-center justify-center text-center mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white drop-shadow-xl">
          {movie.title}
        </h2>
        {/* MediaRatingBadge circular badge */}
        <div className="flex flex-col items-center mb-4">
          <MediaRatingBadge voteAverage={movie.vote_average} />
        </div>
        <p className="text-white text-lg md:text-xl mb-6 max-w-2xl line-clamp-5 drop-shadow-md">
          {movie.overview}
        </p>
      </div>
    </section>
  );
}

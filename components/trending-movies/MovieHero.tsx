"use client";

import React from "react";
import type { TMDBMovie } from "@/lib/types/tmdb";
import { MediaHero } from "@/components/shared/MediaHero";

/**
 * MovieHero displays a full-bleed hero section for a single movie, inspired by oktay/movies.
 * @param movie - The TMDBMovie object to feature.
 */
export function MovieHero({ movie }: { movie: TMDBMovie }) {
  if (!movie) return null;

  return (
    <MediaHero
      title={movie.title}
      overview={movie.overview}
      backdropPath={movie.backdrop_path || ""}
      detailsLink={`/movie/${movie.id}`}
    />
  );
}

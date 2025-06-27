import React from "react";
import type { TMDBTVShow } from "@/lib/tmdb/types";
import { MediaHero } from "@/components/shared/MediaHero";

/**
 * TVShowHero displays a full-bleed hero section for a single TV show.
 * @param show - The TMDBTVShow object to feature.
 */
export function TVShowHero({ show }: { show: TMDBTVShow }) {
  if (!show) return null;

  return (
    <MediaHero
      title={show.name}
      overview={show.overview}
      backdropPath={show.backdrop_path || ""}
      detailsLink={`/tv/${show.id}`}
    />
  );
}

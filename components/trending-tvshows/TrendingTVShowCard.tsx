"use client";

import React from "react";
import type { TMDBTVShow } from "@/lib/tmdb/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MediaRatingBadge } from "@/components/media-rating-badge/MediaRatingBadge";
import Link from "next/link";

/**
 * TrendingTVShowCard displays a single trending TV show with its poster and details.
 * Links to the TV show detail page.
 * @param show - The TMDBTVShow object containing show details.
 */
export function TrendingTVShowCard({ show }: { show: TMDBTVShow }) {
  return (
    <Link
      href={`/tv/${show.id}`}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded shadow p-2 flex flex-col items-center relative hover:ring-2 hover:ring-primary transition-all duration-150"
      )}
      aria-label={`TV show card for ${show.name}`}
      prefetch={false}
    >
      <div className="relative w-full flex justify-center">
        {show.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w185${show.poster_path}`}
            alt={`Poster for ${show.name}`}
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
        <div className="absolute bottom-2 left-2 z-10">
          <MediaRatingBadge voteAverage={show.vote_average} size="sm" />
        </div>
      </div>
      <div
        className={cn("text-center mt-2")}
        aria-label={`TV show title and first air date for ${show.name}`}
      >
        <div className="font-semibold text-base line-clamp-2">{show.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{show.first_air_date}</div>
      </div>
    </Link>
  );
}

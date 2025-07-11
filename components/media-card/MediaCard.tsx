"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MediaRatingBadge } from "@/components/media-rating-badge/MediaRatingBadge";
import { WatchLaterButton } from "../watch-later/WatchLaterButton";

/**
 * MediaCardProps defines the props for the MediaCard component.
 */
interface MediaCardProps {
  media: {
    id: number;
    poster_path: string | null;
    vote_average: number;
    name?: string; // For TV shows
    title?: string; // For movies
    first_air_date?: string; // For TV shows
    release_date?: string; // For movies
  };
  type: "movie" | "tv" | "person"; // Specifies whether the media is a movie or TV show or person
  isInWatchLater?: boolean;
}

/**
 * MediaCard displays a single media item (movie or TV show) with its poster and details.
 * Links to the media detail page.
 * @param media - The media object containing details.
 * @param type - The type of media ("movie" or "tv"). It also includes person
 */
export function MediaCard({ media, type, isInWatchLater = false }: MediaCardProps) {
  const mediaTitle = media.title || media.name;
  const mediaDate = media.release_date || media.first_air_date;

  return (
    <Link
      href={`/${type}/${media.id}`}
      className={cn(
        "bg-white dark:bg-zinc-900 rounded shadow p-2 flex flex-col items-center relative hover:ring-2 hover:ring-primary transition-all duration-150"
      )}
      aria-label={`Media card for ${mediaTitle}`}
      prefetch={false}
    >
      <div className="relative w-full flex justify-center">
        {media.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
            alt={`Poster for ${mediaTitle}`}
            width={500} // Maintains sharpness
            height={750} // 2:3 aspect ratio (500 * 3 / 2)
            className={cn("rounded mb-2 w-full h-auto aspect-[2/3]")}
          />
        ) : (
          <div
            className={cn("w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500")}
          >
            <span className={cn("block text-xs text-gray-400")}>No Image</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 z-10">
          <MediaRatingBadge voteAverage={media.vote_average} size="sm" />
        </div>
        {type === "movie" || type === "tv" ? (
          <div className="absolute bottom-2 right-2 z-10">
            <WatchLaterButton 
              mediaId={media.id} 
              mediaType={type} 
              isInWatchLater={isInWatchLater} 
              title={mediaTitle}
            />
          </div>
        ) : null}
      </div>
      <div className={cn("text-center mt-2")} aria-label={`Media title and date for ${mediaTitle}`}>
        <div className="font-semibold text-base line-clamp-2">{mediaTitle}</div>
        <div className="text-xs text-muted-foreground mt-1">{mediaDate}</div>
      </div>
    </Link>
  );
}

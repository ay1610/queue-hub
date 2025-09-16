"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MediaRatingBadge } from "@/components/media-rating-badge/MediaRatingBadge";
import { WatchLaterButton } from "../watch-later/WatchLaterButton";
import { useMovieGenres } from "@/lib/tmdb/movie/hooks";
import { useTVGenres } from "@/lib/tmdb/tv/hooks";
import { getFilteredGenres } from "@/lib/media-utils";
import type { TMDBTVExternalIds } from "@/lib/types/tmdb";

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
    genres?: { id: number; name: string }[];
    genre_ids?: number[];
  };
  type: "movie" | "tv" | "person";
  isInWatchLater?: boolean;
  size?: "small" | "default";
  imdbRating?: number;
  imdbVotes?: number;
  runtimeMins?: number | null;
  externalIds?: TMDBTVExternalIds;
  runtime?: {
    tconst: string;
    title_type: string | null;
    primary_title: string | null;
    runtime_minutes: number | null;
  };
  rating?: {
    tconst: string;
    averageRating: number | null;
    numVotes: number | null;
  };
}

/**
 * MediaCard displays a single media item (movie or TV show) with its poster and details.
 * Links to the media detail page.
 * @param media - The media object containing details.
 * @param type - The type of media ("movie" or "tv").
 */
export function MediaCard({
  media,
  type,
  isInWatchLater = false,
  size = "default",
  imdbRating,
  runtimeMins,
  runtime,
  rating,
}: MediaCardProps) {
  const mediaTitle = media.title || media.name;
  const { data: movieGenreData } = useMovieGenres();
  const { data: tvGenreData } = useTVGenres();
  // Use getFilteredGenres for maintainable genre mapping
  let derivedGenreIds = media.genre_ids;
  if (media.genres && media.genres.length > 0) {
    const mappedGenres = getFilteredGenres(
      media.genres,
      type === "movie" ? movieGenreData : tvGenreData
    );
    if (mappedGenres.length) {
      derivedGenreIds = mappedGenres.map((g) => g.id);
    }
  }
  let mediaGenre = "Unknown Genre";
  if (derivedGenreIds?.length) {
    const genreData = type === "movie" ? movieGenreData : type === "tv" ? tvGenreData : undefined;
    if (!genreData) {
      mediaGenre = "Unknown Genre";
    } else {
      const mappedGenres = getFilteredGenres(
        derivedGenreIds.map((id) => ({ id, name: "" })),
        genreData
      );
      mediaGenre = mappedGenres.length
        ? mappedGenres.map((g) => g.name).join(", ")
        : "Unknown Genre";
    }
  }
  // Card size classes
  const cardSize = size === "small" ? "p-1 w-full max-w-[120px]" : "p-2 w-full";
  const posterSize =
    size === "small"
      ? {
        width: 120,
        height: 180,
        className: "rounded mb-1 w-full h-auto aspect-[2/3]",
        tmdbSize: "w500",
      }
      : {
        width: 500,
        height: 700,
        className: "rounded mb-2 w-full h-auto aspect-[2/3]",
        tmdbSize: "w780",
      };
  const titleSize = size === "small" ? "text-xs" : "text-base";
  const genreSize = size === "small" ? "text-[10px]" : "text-xs";

  return (
    <Link
      href={`/${type}/${media.id}`}
      className={cn(
        `rounded shadow flex flex-col items-center relative hover:ring-2 hover:ring-primary transition-all duration-150 ${cardSize}`
      )}
      aria-label={`Media card for ${mediaTitle}`}
      prefetch={false}
    >
      <div className="relative w-full flex justify-center">
        <div className="w-full">
          {media.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/${posterSize.tmdbSize}${media.poster_path}`}
              alt={`Poster for ${mediaTitle}`}
              width={posterSize.width}
              height={posterSize.height}
              className={posterSize.className}
              priority={false}
              draggable={false}
            />
          ) : (
            <div
              className={cn(
                posterSize.className,
                "bg-gray-800 flex items-center justify-center text-gray-400"
              )}
            >
              No Image
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          <MediaRatingBadge
            voteAverage={rating?.averageRating ?? media.vote_average}
            votes={rating?.numVotes ?? 0}
          />
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
      <div
        className={cn("text-center mt-1", size === "small" ? "mt-1" : "mt-2")}
        aria-label={`Media title and date for ${mediaTitle}`}
      >
        <div className={cn("font-semibold line-clamp-2", titleSize)}>{mediaTitle}</div>
        <div className={cn("text-muted-foreground mt-1", genreSize)}>{mediaGenre}</div>
        {/* Extra info: IMDB rating, votes, runtime */}
        {(imdbRating || runtimeMins || rating || runtime) && (
          <div
            className={cn("flex flex-col items-center mt-1 gap-0.5")}
            aria-label="IMDB and runtime info"
          >
            {/* Prefer runtime prop if present, fallback to runtimeMins */}
            {runtime?.runtime_minutes && (
              <span className="text-xs text-gray-500">{runtime.runtime_minutes} min</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

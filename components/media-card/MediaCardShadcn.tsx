"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { RecommendationBubble } from "./RecommendationBubble";
import { cn } from "@/lib/utils";
import { MediaRatingBadge } from "@/components/media-rating-badge/MediaRatingBadge";
import { WatchLaterButton } from "../watch-later/WatchLaterButton";
import { useMovieGenres } from "@/lib/tmdb/movie/hooks";
import { useTVGenres } from "@/lib/tmdb/tv/hooks";
import { getMediaGenre, getMediaTitle } from "@/lib/media-utils";
import { useImageParallax } from "@/lib/hooks/useImageRotation";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

import { getFormattedRuntimeWithBadge } from "@/lib/media-utils";
import { RuntimeBadge } from "./RuntimeBadge";
import { PrefetchMediaDetailsOnHover } from "./PrefetchMediaDetailsOnHover";
interface MediaCardProps {
  media: {
    id: number;
    poster_path: string | null;
    vote_average: number;
    name?: string;
    title?: string;
    first_air_date?: string;
    release_date?: string;
    genres?: { id: number; name: string }[];
    genre_ids?: number[];
  };
  type: "movie" | "tv" | "person";
  isInWatchLater?: boolean;
  size?: "small" | "default";
  fromUsername?: string | null;
  fromUserImage?: string | null;
  message?: string | null;
  imdbRating?: number;
  imdbVotes?: number;
  runtimeMins?: number | null;
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

export function MediaCardShadcn({
  media,
  type,
  isInWatchLater = false,
  size = "default",
  fromUsername,
  fromUserImage,
  message,
  imdbRating,
  imdbVotes,
  runtimeMins,
  runtime,
  rating,
}: MediaCardProps) {
  const { parallax, handlers } = useImageParallax();
  const mediaTitle = getMediaTitle(media);
  const { data: movieGenreData } = useMovieGenres();
  const { data: tvGenreData } = useTVGenres();
  const mediaGenre =
    type === "movie" || type === "tv"
      ? getMediaGenre(media, type, movieGenreData, tvGenreData)
      : "Unknown Genre";
  const cardSize =
    size === "small"
      ? "p-1 w-full max-w-[160px] h-[325px]"
      : "p-2 w-full max-w-[340px] h-[350px] sm:h-[525px]"; // Responsive: shorter on mobile, default on desktop
  const posterSize =
    size === "small"
      ? {
        width: 160,
        height: 240,
        className: "rounded-lg mb-0.5 sm:mb-1 w-full h-auto aspect-[2/3]", // less margin on mobile
        tmdbSize: "w500",
      }
      : {
        width: 340,
        height: 510,
        className: "rounded-lg mb-1 sm:mb-2 w-full h-auto aspect-[2/3]", // less margin on mobile
        tmdbSize: "w780",
      };
  const titleSize = size === "small" ? "text-xs" : "text-sm";
  const genreSize = size === "small" ? "text-[10px]" : "text-xs";

  // Runtime and badge logic
  const runtimeValue = runtime?.runtime_minutes ?? runtimeMins ?? null;
  const { formatted: formattedRuntime } = getFormattedRuntimeWithBadge(
    runtimeValue,
    type === "movie" ? "movie" : "tv"
  );

  const card = (
    <Link
      href={`/${type}/${media.id}`}
      className={cn("block", cardSize)}
      aria-label={`Media card for ${mediaTitle}`}
      prefetch={false}
    >
      <CardContainer className="w-full h-full">
        <CardBody className="w-full h-full flex flex-col items-center rounded-lg p-1 bg-white/80 dark:bg-zinc-900/80">
          <CardItem className="w-full">
            {fromUsername && (
              <RecommendationBubble
                fromUsername={fromUsername}
                fromUserImage={fromUserImage}
                message={message}
              />
            )}
            <motion.div
              className="relative w-full aspect-[2/3] flex justify-center items-center media-card-image-rotate"
              style={parallax}
              {...handlers}
            >
              {media.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/${posterSize.tmdbSize}${media.poster_path}`}
                  alt={`Poster for ${mediaTitle}`}
                  fill
                  className={cn("object-cover w-full h-full rounded-lg aspect-[2/3]", posterSize.className)}
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg",
                    "aspect-[2/3]"
                  )}
                >
                  <span className={cn("block text-xs text-gray-400")}>No Image</span>
                </div>
              )}
            </motion.div>
          </CardItem>
          <CardItem className="w-full">
            <div className="w-full flex flex-row items-center justify-between px-2 pb-1 gap-2 py-0.5 mt-0">
              <MediaRatingBadge
                voteAverage={rating?.averageRating ?? imdbRating ?? media.vote_average}
                votes={rating?.numVotes ?? imdbVotes ?? 0}
              />
              {(type === "movie" || type === "tv") && (
                <WatchLaterButton
                  mediaId={media.id}
                  mediaType={type}
                  isInWatchLater={isInWatchLater}
                  title={mediaTitle}
                />
              )}
            </div>
          </CardItem>
          <CardItem className="w-full text-center p-0 m-0 mt-0">
            <div className={cn("line-clamp-2 m-0 p-0 mb-0.5 sm:mb-2 mt-0", titleSize)}>{mediaTitle}</div>
            <div className={cn("m-0 p-0 mt-0", genreSize)}>{mediaGenre}</div>
            <div
              className={cn("flex flex-col items-center mt-0 gap-0.5")}
              aria-label="Runtime info"
            >
              <RuntimeBadge formattedRuntime={formattedRuntime} glass className="text-gray-500" />
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </Link>
  );

  if (type === "movie" || type === "tv") {
    return (
      <PrefetchMediaDetailsOnHover mediaId={media.id} mediaType={type}>
        {card}
      </PrefetchMediaDetailsOnHover>
    );
  }
  return card;
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { WatchLaterButton } from "../watch-later/WatchLaterButton";
import { RecommendFeature } from "../recommend/RecommendFeature";
import { RecommendationBubble } from "./RecommendationBubble";
import { CircularRating } from "@/components/media-rating-badge/CircularRating";
import { RuntimeBadge } from "./RuntimeBadge";
import { PrefetchMediaDetailsOnHover } from "./PrefetchMediaDetailsOnHover";
import { useMovieGenres } from "@/lib/tmdb/movie/hooks";
import { useTVGenres } from "@/lib/tmdb/tv/hooks";
import { getMediaGenre, getMediaTitle, getFormattedRuntimeWithBadge } from "@/lib/media-utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export interface MediaCardWithActionButtonsProps {
  media: {
    id: number;
    poster_path: string | null;
    vote_average?: number;
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

export function InteractiveMediaCard({
  media,
  type = "movie",
  isInWatchLater = false,
  size = "default",
  fromUsername,
  fromUserImage,
  message,
  imdbRating,
  runtimeMins,
  runtime,
  rating
}: MediaCardWithActionButtonsProps) {
  const mediaTitle = getMediaTitle(media);
  const { data: movieGenreData } = useMovieGenres();
  const { data: tvGenreData } = useTVGenres();
  const mediaGenre =
    type === "movie" || type === "tv"
      ? getMediaGenre(media, type, movieGenreData, tvGenreData)
      : "Unknown Genre";

  // Size configurations
  const hasRecommendation = Boolean(fromUsername || fromUserImage || message);
  const smallBase = "p-1 w-full max-w-[208px] mx-auto";
  const smallHeight = hasRecommendation ? "h-[540px]" : "h-[500px]";
  const cardSize =
    size === "small"
      ? `${smallBase} ${smallHeight}`
      : "p-2 w-full max-w-[340px] h-[600px] sm:h-[640px]";

  const posterSize =
    size === "small"
      ? {
        width: 208,
        height: 312,
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
    <div data-testid="media-card-container" className={cn("block", cardSize)}>
      <CardContainer className="w-full h-full">
        <CardBody className="w-full h-full flex flex-col items-center rounded-lg p-1 bg-white/80 dark:bg-zinc-900/80 overflow-hidden">
          {/* Card Content Section */}
          <div className="w-full flex flex-col items-center">
            <Link
              href={`/${type}/${media.id}`}
              className="w-full block z-0"
              aria-label={`Media card for ${mediaTitle}`}
              prefetch={false}
            >
              <CardItem className="w-full">
                {fromUsername && (
                  <RecommendationBubble
                    fromUsername={fromUsername}
                    fromUserImage={fromUserImage}
                    message={message}
                  />
                )}
                <div className="relative w-full aspect-[2/3] flex justify-center items-center">
                  {media.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/${posterSize.tmdbSize}${media.poster_path}`}
                      alt={`Poster for ${mediaTitle}`}
                      fill
                      className={cn("object-cover w-full h-full rounded-lg aspect-[2/3]", posterSize.className)}
                    />
                  ) : (
                    <div
                      data-testid="no-image-fallback"
                      className={cn(
                        "w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg",
                        "aspect-[2/3]"
                      )}
                    >
                      <span className={cn("block text-xs text-gray-400")}>No Image</span>
                    </div>
                  )}
                  {/** Rating overlay (small size) */}
                  {(type === "movie" || type === "tv") && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "absolute left-1 top-1",
                              size === "small" ? "" : "hidden"
                            )}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            aria-label={`${(rating?.averageRating ?? imdbRating ?? media.vote_average ?? 0).toFixed(1)} rating`}
                          >
                            <CircularRating
                              rating={rating?.averageRating ?? imdbRating ?? media.vote_average ?? 0}
                              source={rating?.averageRating || imdbRating ? "IMDb" : "TMDb"}
                              size="small"
                              showLabel={false}
                              className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start">
                          <span>
                            {(rating?.averageRating || imdbRating ? "IMDb" : "TMDb")} {(
                              rating?.averageRating ?? imdbRating ?? media.vote_average ?? 0
                            ).toFixed(1)}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {/** Watch Later overlay (small size) */}
                  {(type === "movie" || type === "tv") && size === "small" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute right-1 top-1 sm:right-2 sm:top-2 pointer-events-auto z-10"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                          >
                            <WatchLaterButton
                              mediaId={media.id}
                              mediaType={type === "movie" ? "movie" : "tv"}
                              isInWatchLater={isInWatchLater}
                              title={mediaTitle}
                              showText={false}
                              variant="ghost"
                              className={cn(
                                // size & shape
                                "relative w-8 h-8 sm:w-9 sm:h-9 p-1.5 sm:p-2 rounded-xl",
                                // iOS-style Liquid Glass: strong blur, saturation, slight brightness boost
                                "backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-110",
                                // clear glass over media with subtle tint (auto adapts in dark)
                                "bg-white/12 dark:bg-white/10 text-white",
                                // ring + shadow for depth and legibility
                                "ring-1 ring-white/40 dark:ring-white/25 shadow-[0_2px_10px_rgba(0,0,0,0.35)]",
                                // highlight sheen using a gradient overlay
                                "before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.2)_36%,rgba(255,255,255,0)_100%)] before:opacity-40",
                                // interaction affordances: lift slightly and brighten ring
                                "transition-transform duration-200 motion-safe:hover:-translate-y-0.5 hover:ring-white/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
                              )}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" align="start">
                          <span>{isInWatchLater ? "In Watch List" : "Add to Watch List"}</span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardItem>
            </Link>

            {size !== "small" && (
              <div className="w-full mt-4 flex justify-center">
                <CircularRating
                  rating={rating?.averageRating ?? imdbRating ?? media.vote_average ?? 0}
                  source={rating?.averageRating || imdbRating ? "IMDb" : "TMDb"}
                  className="mx-auto"
                />
              </div>
            )}

            <Link
              href={`/${type}/${media.id}`}
              className="w-full block text-center mt-3 z-0"
              aria-label={`Media card for ${mediaTitle}`}
              prefetch={false}
            >
              <CardItem className="w-full text-center p-0 m-0">
                <div className={cn("line-clamp-2 m-0 p-0 mb-0.5 sm:mb-1 mt-0 font-medium", titleSize)}>{mediaTitle}</div>
                <div className={cn("m-0 p-0 mt-0 text-muted-foreground line-clamp-1", genreSize)}>{mediaGenre}</div>
                {formattedRuntime !== "N/A" && (
                  <div className={cn("flex flex-col items-center mt-1 sm:mt-1 gap-0.5")} aria-label="Runtime info">
                    <RuntimeBadge data-testid="runtime-badge" formattedRuntime={formattedRuntime} glass className="text-gray-500 px-2 py-0.5 text-[10px]" />
                  </div>
                )}
              </CardItem>
            </Link>
          </div>

          {/* Card Actions Section - compact icon-only row for small; preserve test id */}
          <div className="w-full mt-2 px-1 relative z-10">
            <div
              data-testid="card-actions-section"
              className={cn(
                // Keep actions interactive even if parent layers have transforms
                "w-full pointer-events-auto",
                size === "small" ? "flex flex-row items-center justify-center gap-2" : "flex flex-col items-center gap-2 p-2 bg-gray-50/90 dark:bg-zinc-800/95 rounded-lg"
              )}
              // Stop click/touch bubbling to the Link above
              onClick={(e) => { e.stopPropagation(); }}
              onMouseDown={(e) => { e.stopPropagation(); }}
              onTouchStart={(e) => { e.stopPropagation(); }}
            >
              {(type === "movie" || type === "tv") && size !== "small" && (
                <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} className="w-full">
                  <WatchLaterButton
                    mediaId={media.id}
                    mediaType={type === "movie" ? "movie" : "tv"}
                    isInWatchLater={isInWatchLater}
                    title={mediaTitle}
                    showText
                    className="w-full h-9"
                  />
                </div>
              )}

              {(type === "movie" || type === "tv") && (
                size === "small" ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                          <RecommendFeature
                            mediaId={media.id}
                            mediaType={type === "movie" ? "movie" : "tv"}
                            mediaTitle={mediaTitle}
                            showText={false}
                            className="w-8 h-8 sm:w-9 sm:h-9 p-1.5 sm:p-2"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center">
                        <span>Recommend</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} className="w-full">
                    <RecommendFeature
                      mediaId={media.id}
                      mediaType={type === "movie" ? "movie" : "tv"}
                      mediaTitle={mediaTitle}
                      showText={true}
                      className="w-full h-9"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </CardBody>
      </CardContainer>
    </div>
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

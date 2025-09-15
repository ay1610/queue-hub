import { MediaBackdrop } from "@/components/MediaBackdrop";
import { MediaWhereToWatch } from "@/components/media-where-to-watch";
import { MediaTrailerDialog } from "@/components/media-trailer-dialog";
import Image from "next/image";
import { RecommendFeature } from "@/components/recommend/RecommendFeature";
import React from "react";
import type { TMDBVideo } from "@/lib/types/tmdb/videos";
import type { WatchProvidersResponse } from "@/lib/tmdb/movie/watchProviders";
import { MediaRatingBadge } from "./media-rating-badge";

/**
 * Props for MediaDetailPage, generic for both movies and TV shows.
 * @property title - The title of the media.
 * @property tagline - The tagline of the media.
 * @property overview - The overview/description.
 * @property backdropPath - The backdrop image path.
 * @property posterPath - The poster image path.
 * @property genres - Array of genres.
 * @property voteAverage - Average vote rating.
 * @property trailer - The trailer video object (YouTube).
 * @property usProviders - US watch providers object.
 */
export interface MediaDetailPageProps {
  id?: number;
  title: string;
  tagline?: string;
  overview?: string;
  backdropPath?: string | null;
  posterPath?: string | null;
  genres?: { id: number; name: string }[];
  // voteAverage?: number; // Removed unused prop
  trailer?: TMDBVideo;
  usProviders?: WatchProvidersResponse["results"]["US"];
  runtimeMins?: string;
  type?: "movie" | "tv";
  imdbRating?: number; // Optional IMDB rating
  imdbVotes?: number; // Optional IMDB votes
}

/**
 * Generic detail page for movies and TV shows.
 * Receives all display data as props.
 */
export function MediaDetailPage({
  id,
  title,
  tagline,
  overview,
  backdropPath,
  posterPath,
  genres,
  // voteAverage,
  trailer,
  usProviders,
  runtimeMins,
  type,
  imdbRating,
  imdbVotes,
}: MediaDetailPageProps) {
  return (
    <>
      <div className="relative min-h-[70vh] w-full pb-32">
        {/* Hero Section with Backdrop */}
        {backdropPath && (
          <MediaBackdrop src={`https://image.tmdb.org/t/p/original${backdropPath}`} alt={title} />
        )}
        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8 max-w-4xl mx-auto px-4 pt-16 md:pt-48 pb-12">
          {/* Poster */}
          {posterPath && (
            <div className="w-40 md:w-56 shrink-0 shadow-xl rounded-lg overflow-hidden border-2 border-white dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Image
                src={`https://image.tmdb.org/t/p/w342${posterPath}`}
                alt={title}
                width={342}
                height={513}
                className="w-full h-auto"
                priority
              />
            </div>
          )}
          {/* Title, Tagline, Overview, Rating, Genres, Providers */}
          <div className="flex flex-col justify-end md:pb-8 bg-black/60 dark:bg-zinc-900/70 p-6 rounded-lg shadow max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
              {title}
            </h1>
            {tagline && <p className="italic text-lg text-gray-200 mb-2">{tagline}</p>}
            {overview && (
              <p className="text-base leading-relaxed mb-4 text-gray-100 dark:text-gray-300">
                {overview}
              </p>
            )}
            <div className="flex items-center gap-4 mb-4">
              {/* <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-lg shadow">
                {voteAverage?.toFixed(1)}
              </span> */}
              {imdbRating && <MediaRatingBadge voteAverage={imdbRating} votes={imdbVotes} />}

              {genres && genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-white/80 dark:bg-zinc-800/80 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-xs font-semibold shadow border border-gray-200 dark:border-zinc-700"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
              {usProviders && usProviders.flatrate && usProviders.flatrate.length > 0 ? (
                <div className="flex gap-2 flex-wrap items-center">
                  {usProviders.flatrate.map((provider) => (
                    <a
                      key={provider.provider_id}
                      className="inline-flex flex-row items-center gap-2 group hover:scale-105 transition-transform"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        width={45}
                        height={45}
                        className="rounded bg-white dark:bg-zinc-900 p-1 shadow group-hover:ring-2 group-hover:ring-blue-400"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                        {provider.provider_name}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  No streaming providers found.
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <MediaTrailerDialog trailer={trailer} />
              {/* TODO: Implement Watch Later Button */}
              {/* <WatchLaterButton mediaId={mediaId} mediaType={mediaType} isInWatchLater={isInWatchLater} /> */}
              <RecommendFeature mediaId={id} mediaType={type} mediaTitle={title} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Runtime: {runtimeMins}</p>
          </div>
        </div>
      </div>
      {/* Where to Watch Section - ensure no overlap by adding large margin-top */}
      <div className="max-w-4xl mx-auto px-4 mt-16 mb-12">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Where to Watch</h2>
        <MediaWhereToWatch usProviders={usProviders} />
      </div>
    </>
  );
}

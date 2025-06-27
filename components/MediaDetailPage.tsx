import { MediaBackdrop } from "@/components/MediaBackdrop";
import { MediaWhereToWatch } from "@/components/media-where-to-watch";
import { MediaTrailerDialog } from "@/components/media-trailer-dialog";
import Image from "next/image";
import React from "react";
import type { TMDBVideo } from "@/lib/tmdb/movie/videos";
import type { WatchProvidersResponse } from "@/lib/tmdb/movie/watchProviders";

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
  title: string;
  tagline?: string;
  overview?: string;
  backdropPath?: string | null;
  posterPath?: string | null;
  genres?: { id: number; name: string }[];
  voteAverage?: number;
  trailer?: TMDBVideo;
  usProviders?: WatchProvidersResponse["results"]["US"];
}

/**
 * Generic detail page for movies and TV shows.
 * Receives all display data as props.
 */
export function MediaDetailPage({
  title,
  tagline,
  overview,
  backdropPath,
  posterPath,
  genres,
  voteAverage,
  trailer,
  usProviders,
}: MediaDetailPageProps) {
  return (
    <>
      <div className="relative min-h-[70vh] w-full pb-32">
        {/* Hero Section with Backdrop */}
        {backdropPath && (
          <MediaBackdrop src={`https://image.tmdb.org/t/p/original${backdropPath}`} alt={title} />
        )}
        <div className="relative z-10 flex flex-col md:flex-row gap-8 max-w-4xl mx-auto px-4 pt-16 md:pt-48 pb-12">
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
          {/* Title, Tagline, Rating */}
          <div className="flex flex-col justify-end md:pb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
              {title}
            </h1>
            {tagline && <p className="italic text-lg text-gray-200 mb-2">{tagline}</p>}
            {overview && (
              <p className="text-base text-gray-100 dark:text-gray-300 leading-relaxed mb-4 max-w-2xl">
                {overview}
              </p>
            )}
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-lg shadow">
                {voteAverage?.toFixed(1)}
              </span>
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
            </div>
            {/* Trailer Button - open dialog on click */}
            <MediaTrailerDialog trailer={trailer} />
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

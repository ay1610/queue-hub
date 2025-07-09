import { MediaBackdrop } from "@/components/MediaBackdrop";
import { MediaWhereToWatch } from "@/components/media-where-to-watch";
import { MediaTrailerDialog } from "@/components/media-trailer-dialog";
import Image from "next/image";
import React from "react";
import type { TMDBVideo } from "@/lib/tmdb/movie/videos";
import type { WatchProvidersResponse } from "@/lib/tmdb/movie/watchProviders";
import type { TMDBMovie, TMDBTVShow } from "@/lib/types/tmdb";

/**
 * Props for MediaDetailPage, generic for both movies and TV shows.
 * @property media - The movie or TV show object.
 * @property trailer - The trailer video object (YouTube).
 * @property usProviders - US watch providers object.
 */
export interface MediaDetailPageProps {
  media: TMDBMovie | TMDBTVShow;
  trailer?: TMDBVideo;
  usProviders?: WatchProvidersResponse["results"]["US"];
}

/**
 * Generic detail page for movies and TV shows.
 * Receives all display data as props.
 */
export function MediaDetailPage({ media, trailer, usProviders }: MediaDetailPageProps) {
  const title = "title" in media ? media.title : media.name;

  return (
    <>
      <div className="relative min-h-[70vh] w-full pb-32">
        {/* Hero Section with Backdrop */}
        {media.backdrop_path && (
          <MediaBackdrop
            src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
            alt={title}
          />
        )}
        <div className="relative z-10 flex flex-col md:flex-row gap-8 max-w-4xl mx-auto px-4 pt-16 md:pt-48 pb-12">
          {/* Poster */}
          {media.poster_path && (
            <div className="w-40 md:w-56 shrink-0 shadow-xl rounded-lg overflow-hidden border-2 border-white dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Image
                src={`https://image.tmdb.org/t/p/w342${media.poster_path}`}
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
            {media.tagline && <p className="italic text-lg text-gray-200 mb-2">{media.tagline}</p>}
            {media.overview && (
              <p className="text-base text-gray-100 dark:text-gray-300 leading-relaxed mb-4 max-w-2xl">
                {media.overview}
              </p>
            )}
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-lg shadow">
                {media.vote_average?.toFixed(1)}
              </span>
              {media.genres && media.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre: { id: number; name: string }) => (
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
      {/* Where to Watch */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2
          className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100"
          id="where-to-watch"
        >
          Where to Watch
        </h2>
        <MediaWhereToWatch usProviders={usProviders} />
      </div>
    </>
  );
}

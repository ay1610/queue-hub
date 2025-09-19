import { MediaBackdrop } from "@/components/MediaBackdrop";
import React from "react";
import type { TMDBVideo } from "@/lib/types/tmdb/videos";
import { MediaLayout } from "./media-detail/MediaLayout";
import { MediaPoster } from "./media-detail/MediaPoster";
import { MediaContent } from "./media-detail/MediaContent";
import { MediaWhereToWatch } from "./media-where-to-watch/MediaWhereToWatch";

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
 */
export interface MediaDetailPageProps {
  id?: number;
  title: string;
  tagline?: string;
  overview?: string;
  backdropPath?: string | null;
  posterPath: string | null;
  genres?: { id: number; name: string }[];
  trailer?: TMDBVideo;
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
  trailer,
  runtimeMins,
  type,
  imdbRating,
  imdbVotes,
}: MediaDetailPageProps) {
  return (
    <>
      <MediaLayout
        backdrop={
          backdropPath && (
            <MediaBackdrop src={`https://image.tmdb.org/t/p/original${backdropPath}`} alt={title} />
          )
        }
      >
        <MediaPoster path={posterPath} alt={title} />
        <MediaContent
          title={title}
          tagline={tagline}
          overview={overview}
          genres={genres}
          trailer={trailer}
          runtimeMins={runtimeMins}
          mediaId={id}
          mediaType={type}
          imdbRating={imdbRating}
          imdbVotes={imdbVotes}
        />
      </MediaLayout>

      {/* Where to Watch Section - Moved below the main content */}
      {id && type && (
        <div className="mt-8 sm:mt-12 pb-8 max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-gray-100">Where to Watch</h2>
          <div className="bg-white/90 dark:bg-zinc-900/90 rounded-lg shadow-lg p-4 sm:p-6">
            <MediaWhereToWatch mediaId={id} mediaType={type} />
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useMemo } from "react";
import { InteractiveMediaCard } from "../media-card/MediaCardWithActionButtons";
import { MediaDetails } from "@/lib/tmdb/types";
import { TMDBMovie, TMDBTVShow } from "@/lib/types/tmdb";
import { useBatchExternalIds } from "@/components/media/useBatchExternalIds";
import { useBatchRuntime, type RuntimeDataResult } from "@/components/media/useBatchRuntime";
import { useBatchRatings, type TitleRatingResult } from "@/components/media/useBatchRatings";

function isMovie(media: MediaDetails): media is TMDBMovie {
  return "title" in media;
}

function isTVShow(media: MediaDetails): media is TMDBTVShow {
  return "name" in media;
}

export interface WatchLaterListProps {
  isLoading: boolean;
  error: unknown;
  data: { mediaId: number; mediaType: string }[] | undefined;
  details: Array<{ data?: MediaDetails } | undefined>;
}

export const WatchLaterList: React.FC<WatchLaterListProps> = ({
  isLoading,
  error,
  data,
  details,
}) => {
  // Build tmdb id lists for movies and tv separately
  const movieIds = useMemo(() =>
    (data ?? [])
      .filter((d) => d.mediaType === "movie")
      .map((d) => d.mediaId),
    [data]
  );
  const tvIds = useMemo(() =>
    (data ?? [])
      .filter((d) => d.mediaType === "tv")
      .map((d) => d.mediaId),
    [data]
  );

  // Batch fetch external IDs to get IMDb ids
  const { data: movieExternalIds } = useBatchExternalIds("movie", movieIds);
  const { data: tvExternalIds } = useBatchExternalIds("tv", tvIds);

  // Build TMDB -> IMDb map from the two batches
  const tmdbToImdbMap = useMemo(() => {
    const map = new Map<number, string>();
    if (movieExternalIds && movieExternalIds.length) {
      movieIds.forEach((tmdbId, idx) => {
        const imdb = movieExternalIds[idx]?.imdb_id ?? null;
        if (tmdbId && imdb) map.set(tmdbId, imdb);
      });
    }
    if (tvExternalIds && tvExternalIds.length) {
      tvIds.forEach((tmdbId, idx) => {
        const imdb = tvExternalIds[idx]?.imdb_id ?? null;
        if (tmdbId && imdb) map.set(tmdbId, imdb);
      });
    }
    return map;
  }, [movieExternalIds, tvExternalIds, movieIds, tvIds]);

  // Prepare unique IMDb ids for batch runtime and ratings
  const imdbIds = useMemo(() => Array.from(new Set(Array.from(tmdbToImdbMap.values()))), [tmdbToImdbMap]);

  // Batch fetch runtime and ratings from IMDb ids
  const { data: runtimeBatch } = useBatchRuntime(imdbIds);
  const { data: ratingBatch } = useBatchRatings(imdbIds);

  // Build lookup maps for O(1) access when rendering
  const runtimeMap = useMemo(() =>
    (runtimeBatch ?? []).reduce<Record<string, RuntimeDataResult>>((acc, r) => {
      if (r.tconst) acc[r.tconst] = r;
      return acc;
    }, {}),
    [runtimeBatch]
  );
  const ratingMap = useMemo(() =>
    (ratingBatch ?? []).reduce<Record<string, TitleRatingResult>>((acc, r) => {
      if (r.tconst) acc[r.tconst] = r;
      return acc;
    }, {}),
    [ratingBatch]
  );

  if (isLoading) {
    // Show 8 skeleton cards for loading state
    return (
      <div className="grid grid-cols-2 md:[grid-template-columns:repeat(auto-fit,minmax(208px,1fr))] gap-4 justify-center">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="animate-pulse p-1 w-full max-w-[208px] h-[500px] mx-auto">
            <div className="relative w-full aspect-[2/3] mb-2">
              <div className="absolute left-1 top-1 h-8 w-8 rounded-full bg-gray-300/80 dark:bg-zinc-700/80" />
              <div className="absolute right-1 top-1 h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gray-300/70 dark:bg-zinc-700/70 border border-white/20" />
              <div className="w-full h-full rounded-lg bg-gray-200 dark:bg-zinc-800" />
            </div>
            <div className="h-3 bg-gray-300 dark:bg-zinc-700 rounded mb-1 w-full" />
            <div className="h-2.5 bg-gray-200 dark:bg-zinc-800 rounded mb-2 w-2/3" />
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-zinc-800 h-5 w-16 mb-2" />
            <div className="flex items-center justify-center mt-2">
              <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) return <p>Error loading watch list</p>;
  if (!data || data.length === 0) return <p>Your watch list is empty</p>;

  return (
    <>
      <p>Found {data.length} items in your watch list</p>
      <div className="grid grid-cols-2 md:[grid-template-columns:repeat(auto-fit,minmax(208px,1fr))] gap-4 justify-center">
        {data.map((item, index) => {
          const detailsObj = details[index];
          if (!detailsObj?.data) return null;
          const imdbId = tmdbToImdbMap.get(item.mediaId);
          const runtime = imdbId ? runtimeMap[imdbId] : undefined;
          const rating = imdbId ? ratingMap[imdbId] : undefined;
          return (
            <div key={`${item.mediaType}-${item.mediaId}`}>
              {isMovie(detailsObj.data) ? (
                <InteractiveMediaCard
                  media={detailsObj.data}
                  type="movie"
                  isInWatchLater={true}
                  size="small"
                  runtime={runtime}
                  rating={rating}
                />
              ) : (
                isTVShow(detailsObj.data) && (
                  <InteractiveMediaCard
                    media={detailsObj.data}
                    type="tv"
                    isInWatchLater={true}
                    size="small"
                    runtime={runtime}
                    rating={rating}
                  />
                )
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

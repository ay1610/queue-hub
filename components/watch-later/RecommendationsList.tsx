import React, { useMemo } from "react";
import { InteractiveMediaCard } from "@/components/media-card/MediaCardWithActionButtons";
// import { MediaCard } from "../media-card/MediaCard";
import { MediaDetails } from "@/lib/tmdb/types";
import { TMDBMovie, TMDBTVShow } from "@/lib/types/tmdb";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";
import { buildKey } from "@/lib/watch-later-utils";
import { useBatchExternalIds } from "@/components/media/useBatchExternalIds";
import { useBatchRuntime, type RuntimeDataResult } from "@/components/media/useBatchRuntime";
import { useBatchRatings, type TitleRatingResult } from "@/components/media/useBatchRatings";
function isMovie(media: MediaDetails): media is TMDBMovie {
  return "title" in media;
}

function isTVShow(media: MediaDetails): media is TMDBTVShow {
  return "name" in media;
}

export interface RecommendationsListProps {
  isLoading: boolean;
  error: unknown;
  recommendations: Array<{
    id: string | number;
    mediaId: number;
    mediaType: string;
    fromUserId?: string;
    fromUsername?: string | null;
    message?: string | null;
    fromUserImage?: string | null;
  }>;
  details: Array<{ data?: MediaDetails } | undefined>;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  isLoading,
  error,
  recommendations,
  details,
}) => {
  const watchLaterLookup = useWatchLaterLookup();

  // Build tmdb id lists for movies and tv separately from recommendations
  const movieIds = useMemo(
    () => (recommendations ?? []).filter((r) => r.mediaType === "movie").map((r) => r.mediaId),
    [recommendations]
  );
  const tvIds = useMemo(
    () => (recommendations ?? []).filter((r) => r.mediaType === "tv").map((r) => r.mediaId),
    [recommendations]
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
  const imdbIds = useMemo(
    () => Array.from(new Set(Array.from(tmdbToImdbMap.values()))),
    [tmdbToImdbMap]
  );

  // Batch fetch runtime and ratings from IMDb ids
  const { data: runtimeBatch } = useBatchRuntime(imdbIds);
  const { data: ratingBatch } = useBatchRatings(imdbIds);

  // Build lookup maps for O(1) access when rendering
  const runtimeMap = useMemo(
    () =>
      (runtimeBatch ?? []).reduce<Record<string, RuntimeDataResult>>((acc, r) => {
        if (r.tconst) acc[r.tconst] = r;
        return acc;
      }, {}),
    [runtimeBatch]
  );
  const ratingMap = useMemo(
    () =>
      (ratingBatch ?? []).reduce<Record<string, TitleRatingResult>>((acc, r) => {
        if (r.tconst) acc[r.tconst] = r;
        return acc;
      }, {}),
    [ratingBatch]
  );
  if (isLoading) {
    // Match WatchLaterList skeleton (small card: overlays + single action)
    return (
      <div className="grid grid-cols-2 md:[grid-template-columns:repeat(auto-fit,minmax(208px,1fr))] gap-4 justify-center mb-10 pb-4 overflow-visible">
        {Array.from({ length: 6 }).map((_, idx) => (
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
  if (error) return <p>Error loading recommendations</p>;
  if (!recommendations || recommendations.length === 0) return <p>No recommendations received.</p>;
  return (
    <>
      <p>Found {recommendations.length} recommendations</p>
      <div className="grid grid-cols-2 md:[grid-template-columns:repeat(auto-fit,minmax(208px,1fr))] gap-4 justify-center mb-10 pb-4 overflow-visible">
        {details.map((detailsObj, index) => {
          const rec = recommendations[index];
          if (!detailsObj?.data || !rec) return null;
          const cardType = isMovie(detailsObj.data)
            ? "movie"
            : isTVShow(detailsObj.data)
              ? "tv"
              : null;
          if (!cardType) return null;
          const isInWatchLater = watchLaterLookup.has(buildKey(rec.mediaId, cardType));
          // Normalize poster_path to string|null
          const normalizedMedia = {
            ...detailsObj.data,
            poster_path:
              detailsObj.data.poster_path === undefined ? null : detailsObj.data.poster_path,
            vote_average:
              detailsObj.data.vote_average === undefined ? 0 : detailsObj.data.vote_average,
          };
          const imdbId = tmdbToImdbMap.get(rec.mediaId);
          const runtime = imdbId ? runtimeMap[imdbId] : undefined;
          const rating = imdbId ? ratingMap[imdbId] : undefined;
          return (
            <div key={rec.id}>
              <InteractiveMediaCard
                media={normalizedMedia}
                type={cardType}
                isInWatchLater={isInWatchLater}
                size="small"
                fromUsername={rec.fromUsername ?? "Unknown"}
                fromUserImage={rec.fromUserImage}
                message={rec.message}
                runtime={runtime}
                rating={rating}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

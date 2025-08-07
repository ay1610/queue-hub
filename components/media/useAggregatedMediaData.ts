import type { TMDBTVExternalIds } from "@/lib/types/tmdb";
import type { RuntimeDataResult } from "./useBatchRuntime";
import type { TitleRatingResult } from "./useBatchRatings";

export function useAggregatedMediaData(
  allMedia: { id: number }[],
  externalIdsBatch: TMDBTVExternalIds[] | undefined,
  runtimeBatch: RuntimeDataResult[] | undefined,
  ratingBatch: TitleRatingResult[] | undefined
) {
  // Build lookup maps for runtime and rating batches for O(1) access
  const runtimeMap = runtimeBatch
    ? runtimeBatch.reduce<Record<string, RuntimeDataResult>>((acc, r) => {
        if (r.tconst) acc[r.tconst] = r;
        return acc;
      }, {})
    : {};
  const ratingMap = ratingBatch
    ? ratingBatch.reduce<Record<string, TitleRatingResult>>((acc, r) => {
        if (r.tconst) acc[r.tconst] = r;
        return acc;
      }, {})
    : {};

  const mediaDataMap = new Map<
    number,
    {
      externalIds: TMDBTVExternalIds | undefined;
      runtime: RuntimeDataResult | undefined;
      rating: TitleRatingResult | undefined;
    }
  >();

  allMedia.forEach((media, idx) => {
    const ext = externalIdsBatch?.[idx];
    const imdb_id = ext?.imdb_id;
    const runtime = imdb_id ? runtimeMap[imdb_id] : undefined;
    const rating = imdb_id ? ratingMap[imdb_id] : undefined;
    mediaDataMap.set(media.id, {
      externalIds: ext,
      runtime,
      rating,
    });
  });
  return mediaDataMap;
}

import { useBatchExternalIds } from "@/components/media/useBatchExternalIds";
import { useBatchRuntime } from "@/components/media/useBatchRuntime";
import { useBatchRatings } from "@/components/media/useBatchRatings";
import { useAggregatedMediaData } from "@/components/media/useAggregatedMediaData";

// AggregatedMediaData type should match what useAggregatedMediaData returns
export function useAggregatedMediaDataBatch(type: "movie" | "tv", items: Array<{ id: number }>) {
  // 1. Collect all TMDB IDs
  const tmdbIds = items.map((item) => item.id);

  // 2. Fetch external IDs in batch
  const {
    data: externalIdsBatch,
    isLoading: loadingExternalIds,
    error: errorExternalIds,
  } = useBatchExternalIds(type, tmdbIds);

  // 3. Extract IMDB IDs (if available)
  const imdbIds = (externalIdsBatch ?? [])
    .map((ext: { imdb_id?: string | null }) => ext?.imdb_id)
    .filter((id: string | null | undefined): id is string => !!id);

  // 4. Fetch runtimes and ratings in batch
  const {
    data: runtimeBatch,
    isLoading: loadingRuntime,
    error: errorRuntime,
  } = useBatchRuntime(imdbIds);
  const {
    data: ratingBatch,
    isLoading: loadingRatings,
    error: errorRatings,
  } = useBatchRatings(imdbIds);

  // 5. Aggregate all data
  const showDataMap = useAggregatedMediaData(items, externalIdsBatch, runtimeBatch, ratingBatch);

  // 6. Compose loading and error states
  const loading = loadingExternalIds || loadingRuntime || loadingRatings;
  const error = errorExternalIds || errorRuntime || errorRatings;

  return { showDataMap, loading, error };
}

import { useQuery, useQueries, type UseQueryOptions } from "@tanstack/react-query";
import { getMovieDetails } from "./tmdb/movie/client";
import { getTVShowDetails } from "./tmdb/tv/client";
import { WatchLaterItem, WatchLaterMediaType } from "./types/watch-later";
import { TMDBMovie, TMDBTVShow } from "./types/tmdb";
import { MEDIA_DETAILS_CACHE } from "./cache-config";

// Type for media details (either movie or TV show)
export type MediaDetails = TMDBMovie | TMDBTVShow;

// Query key factory for media details
export const mediaDetailsKeys = {
  all: ["media-details"] as const,
  detail: (id: number, type: WatchLaterMediaType) => [...mediaDetailsKeys.all, type, id] as const,
};

export function useMediaDetails<TData = MediaDetails>(
  mediaId: number,
  mediaType: WatchLaterMediaType,
  options?: Partial<UseQueryOptions<MediaDetails, Error, TData>>
) {
  return useQuery({
    queryKey: mediaDetailsKeys.detail(mediaId, mediaType),
    queryFn: async (): Promise<MediaDetails> => {
      if (mediaType === "movie") {
        return getMovieDetails(mediaId);
      } else {
        return getTVShowDetails(mediaId);
      }
    },
    ...MEDIA_DETAILS_CACHE,
    ...options,
  });
}

/**
 * Hook to fetch detailed information for watch later items
 * Similar to useWatchLaterItemsDetails but with a more descriptive name
 *
 * @param items - Array of watch later items to fetch details for
 * @returns Array of query results containing media details for each item
 */
export function useWatchLaterMediaInfo(items: WatchLaterItem[]) {
  return useQueries({
    queries: items.map((item) => ({
      queryKey: mediaDetailsKeys.detail(item.mediaId, item.mediaType),
      queryFn: async (): Promise<MediaDetails> => {
        if (item.mediaType === "movie") {
          return getMovieDetails(item.mediaId);
        } else {
          return getTVShowDetails(item.mediaId);
        }
      },
      ...MEDIA_DETAILS_CACHE,
    })),
  });
}

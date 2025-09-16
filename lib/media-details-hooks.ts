// ...existing code from watch-later-details-hooks.ts...
import { useQueries, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { getMovieDetails } from "./tmdb/movie/client";
import { getTVShowDetails } from "./tmdb/tv/client";
import { WatchLaterItem, WatchLaterMediaType } from "./types/watch-later";
import { MediaDetails } from "./tmdb/types";
import { MEDIA_DETAILS_CACHE } from "./cache-config";
import { useTVGenres } from "./tmdb/tv/hooks";
import { useEffect } from "react";

// Query key factory for media details
export const mediaDetailsKeys = {
  all: ["media-details"] as const,
  detail: (id: number, type: WatchLaterMediaType) => [...mediaDetailsKeys.all, type, id] as const,
  tvGenres: ["tv-genres"] as const,
};

/**
 * Prefetches and caches TV genres in the query client for use in other queries/components.
 *
 * @param mediaType - The type of media ("movie" or "tv"). Prefetch only occurs for "tv".
 */
export function useTVGenresPrefetch(mediaType: WatchLaterMediaType) {
  const queryClient = useQueryClient();
  const { data: tvGenres } = useTVGenres();

  useEffect(() => {
    if (mediaType === "tv" && tvGenres) {
      queryClient.setQueryData(mediaDetailsKeys.tvGenres, tvGenres);
    }
  }, [mediaType, tvGenres, queryClient]);
}

/**
 * Fetches detailed media information, including US watch providers, for a given mediaId and type.
 *
 * @template TData - The type of data returned (default: MediaDetails).
 * @param mediaId - The ID of the media item to fetch.
 * @param mediaType - The type of media ("movie" or "tv").
 * @param options - Optional query options for react-query.
 * @returns A react-query useQuery result containing media details.
 */
export function useMediaDetails<TData = MediaDetails>(
  mediaId: number,
  mediaType: "movie" | "tv",
  options?: Partial<UseQueryOptions<MediaDetails, Error, TData>>
) {
  useTVGenresPrefetch(mediaType);

  const queryFn = async (): Promise<MediaDetails> => {
    if (mediaId === -1) {
      return Promise.reject({
        name: "InvalidMediaIdError",
        message: "Invalid mediaId provided to useMediaDetails hook.",
        mediaId,
      });
    }

    if (mediaType === "movie") {
      const movieDetails = await getMovieDetails(mediaId, "watch/providers");
      const usProviders = movieDetails.watchProviders?.results?.US;
      return {
        ...movieDetails,
        type: "movie",
        usProviders: usProviders || undefined,
      };
    } else {
      const tvDetails = await getTVShowDetails(mediaId, "watch/providers");
      const usProviders = tvDetails.watchProviders?.results?.US;
      return {
        ...tvDetails,
        type: "tv",
        usProviders: usProviders || undefined,
      };
    }
  };

  return useQuery({
    queryKey: mediaDetailsKeys.detail(mediaId, mediaType),
    queryFn,
    enabled: mediaId !== -1,
    ...MEDIA_DETAILS_CACHE,
    ...options,
  });
}

/**
 * Fetches detailed information for an array of watch later items (movies or TV shows).
 * Returns an array of react-query useQuery results for each item.
 *
 * @param items - Array of watch later items to fetch details for.
 * @returns Array of query results containing media details for each item.
 */
export function useWatchLaterMediaInfo(items: WatchLaterItem[]) {
  const queries = items.map((item) => ({
    queryKey: mediaDetailsKeys.detail(item.mediaId, item.mediaType),
    queryFn: async (): Promise<MediaDetails> => {
      if (item.mediaType === "movie") {
        const movieDetails = await getMovieDetails(item.mediaId);
        return {
          ...movieDetails,
          type: "movie",
        };
      } else {
        const tvDetails = await getTVShowDetails(item.mediaId);
        return {
          ...tvDetails,
          type: "tv",
        };
      }
    },
    ...MEDIA_DETAILS_CACHE,
  }));

  return useQueries({ queries });
}

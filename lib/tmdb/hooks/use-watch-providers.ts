import { useQuery } from "@tanstack/react-query";
import { useRegionStore } from "@/lib/stores/region-store";
import { getMovieWatchProviders } from "@/lib/tmdb/movie/watch-providers";
import { getTVWatchProviders } from "@/lib/tmdb/tv/watch-providers";
import { TMDB_CACHE } from "@/lib/cache-config";

// Query keys for cache management
export const watchProvidersKeys = {
  all: ["watchProviders"] as const,
  movie: (id: number, region: string) => [...watchProvidersKeys.all, "movie", id, region] as const,
  tv: (id: number, region: string) => [...watchProvidersKeys.all, "tv", id, region] as const,
};

/**
 * Custom hook to fetch watch providers for a movie, using the selected region
 * from the store
 */
export function useMovieWatchProviders(movieId: number) {
  const { getRegionCode } = useRegionStore();
  const regionCode = getRegionCode();

  return useQuery({
    queryKey: watchProvidersKeys.movie(movieId, regionCode),
    queryFn: async () => {
      const response = await getMovieWatchProviders(movieId);
      return response.results[regionCode] || null;
    },
    ...TMDB_CACHE.MEDIUM,
  });
}

/**
 * Custom hook to fetch watch providers for a TV show, using the selected region
 * from the store
 */
export function useTVWatchProviders(tvId: number) {
  const { getRegionCode } = useRegionStore();
  const regionCode = getRegionCode();

  return useQuery({
    queryKey: watchProvidersKeys.tv(tvId, regionCode),
    queryFn: async () => {
      const response = await getTVWatchProviders(tvId);
      return response.results[regionCode] || null;
    },
    ...TMDB_CACHE.MEDIUM,
  });
}

/**
 * Combined hook that returns the appropriate watch providers based on media type
 */
export function useMediaWatchProviders(mediaId: number, mediaType: "movie" | "tv") {
  const movieProviders = useMovieWatchProviders(mediaId);
  const tvProviders = useTVWatchProviders(mediaId);

  return mediaType === "movie" ? movieProviders : tvProviders;
}

"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { TMDB_CACHE } from "../cache-config";
import { getRuntimeData, RuntimeDataApiError } from "../runtime/client";
import { RuntimeAPIResponse } from "../types";

// Query key factory for runtime data functionality
export const runtimeDataKeys = {
  all: ["runtime-data"] as const,
  detail: (imdbId: string) => [...runtimeDataKeys.all, imdbId] as const,
} as const;

// Reusable query options factory
export function runtimeDataQueryOptions<TData = RuntimeAPIResponse>(
  imdbId: string | null | undefined,
  options?: Partial<UseQueryOptions<RuntimeAPIResponse, Error, TData>>
) {
  return {
    queryKey: imdbId ? runtimeDataKeys.detail(imdbId) : ["runtime-data", "disabled"],
    queryFn: () => {
      if (!imdbId) {
        throw new Error("IMDB ID is required");
      }
      return getRuntimeData(imdbId);
    },
    enabled: !!imdbId, // Only run query if IMDB ID is available
    ...TMDB_CACHE.LONG, // Runtime data doesn't change often
    retry: (failureCount, error) => {
      // Don't retry for client errors (4xx status codes)
      if (error instanceof RuntimeDataApiError) {
        return error.status < 500 ? false : failureCount < 3;
      }
      // For other errors, retry up to 3 times
      return failureCount < 3;
    },
    ...options,
  } satisfies UseQueryOptions<RuntimeAPIResponse, Error, TData>;
}

/**
 * Fetches runtime data from our API using IMDB ID.
 * Runtime data includes title type, primary title, and runtime minutes from IMDB dataset.
 *
 * @template TData - The type of data returned (default: RuntimeAPIResponse).
 * @param imdbId - The IMDB ID (e.g., "tt1375666") to fetch runtime data for.
 * @param options - Optional query options for react-query.
 * @returns A react-query useQuery result containing runtime data.
 */
export function useRuntimeData<TData = RuntimeAPIResponse>(
  imdbId: string | null | undefined,
  options?: Partial<UseQueryOptions<RuntimeAPIResponse, Error, TData>>
) {
  return useQuery({
    queryKey: runtimeDataKeys.detail(imdbId || ""),
    queryFn: () => {
      if (!imdbId) {
        throw new RuntimeDataApiError(
          "Invalid IMDB ID provided to useRuntimeData hook.",
          "INVALID_IMDB_ID",
          400,
          new Date().toISOString()
        );
      }
      return getRuntimeData(imdbId);
    },
    enabled: !!imdbId,
    ...TMDB_CACHE.LONG,
    retry: (failureCount, error) => {
      // Don't retry for client errors (4xx status codes)
      if (error instanceof RuntimeDataApiError) {
        return error.status < 500 ? false : failureCount < 3;
      }
      // For other errors, retry up to 3 times
      return failureCount < 3;
    },
    ...options,
  });
}

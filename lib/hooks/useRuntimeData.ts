"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { TMDB_CACHE } from "../cache-config";
import { getRuntimeData, RuntimeDataApiError } from "../api/client";
import { RuntimeAPIResponse } from "../types";

export const runtimeDataKeys = {
  all: ["runtime-data"] as const,
  detail: (imdbId: string) => [...runtimeDataKeys.all, imdbId] as const,
} as const;
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
    enabled: !!imdbId,
    ...TMDB_CACHE.LONG,
    retry: (failureCount, error) => {
      if (error instanceof RuntimeDataApiError) {
        return error.status < 500 ? false : failureCount < 3;
      }
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
      if (error instanceof RuntimeDataApiError) {
        return error.status < 500 ? false : failureCount < 3;
      }
      return failureCount < 3;
    },
    ...options,
  });
}

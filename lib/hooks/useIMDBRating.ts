import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { TMDB_CACHE } from "../cache-config";

// Batch API client for ratings
async function getIMDBRatings(imdbIds: string[]): Promise<IMDBRatingAPIResponse[]> {
  if (!imdbIds || !Array.isArray(imdbIds) || imdbIds.length === 0) {
    throw new IMDBRatingApiError(
      "Invalid imdbIds array provided to getIMDBRatings function.",
      "INVALID_IMDB_IDS",
      400,
      new Date().toISOString()
    );
  }
  const response = await fetch("/api/title-rating/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imdbIds }),
  });
  if (!response.ok) {
    try {
      const errorData: IMDBRatingAPIErrorResponse = await response.json();
      throw new IMDBRatingApiError(
        errorData.error,
        errorData.code,
        response.status,
        errorData.timestamp
      );
    } catch {
      throw new IMDBRatingApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        "UNKNOWN_ERROR",
        response.status,
        new Date().toISOString()
      );
    }
  }
  const data = await response.json();
  // The batch API returns { data: IMDBRatingData[], timestamp }
  return data.data;
}

export const imdbRatingsKeys = {
  all: ["imdb-ratings"] as const,
  batch: (imdbIds: string[]) => ["imdb-ratings", ...imdbIds] as const,
} as const;

/**
 * Fetches IMDB rating data for a batch of IMDB IDs using the batch API.
 * Returns an array of IMDBRatingData objects, preserving input order.
 *
 * @param imdbIds - Array of IMDB IDs to fetch ratings for.
 * @param options - Optional query options for react-query.
 * @returns A react-query useQuery result containing an array of rating data.
 */
export function useIMDBRatings(
  imdbIds: string[],
  options?: Partial<UseQueryOptions<IMDBRatingAPIResponse[], Error, IMDBRatingAPIResponse[]>>
) {
  const queryKey =
    imdbIds && imdbIds.length > 0 ? imdbRatingsKeys.batch(imdbIds) : ["imdb-ratings", "disabled"];
  return useQuery({
    queryKey,
    queryFn: () => getIMDBRatings(imdbIds),
    enabled: Array.isArray(imdbIds) && imdbIds.length > 0,
    ...TMDB_CACHE.LONG,
    retry: (failureCount, error) => {
      if (error instanceof IMDBRatingApiError) {
        return error.status < 500 ? false : failureCount < 3;
      }
      return failureCount < 3;
    },
    ...options,
  });
}

// API client for ratings (modeled after getRuntimeData)
async function getIMDBRating(imdbId: string): Promise<IMDBRatingAPIResponse> {
  if (!imdbId) {
    throw new IMDBRatingApiError(
      "Invalid IMDB ID provided to getIMDBRating function.",
      "INVALID_IMDB_ID",
      400,
      new Date().toISOString()
    );
  }

  const response = await fetch(`/api/title-rating?imdbId=${encodeURIComponent(imdbId)}`);

  if (!response.ok) {
    try {
      const errorData: IMDBRatingAPIErrorResponse = await response.json();
      throw new IMDBRatingApiError(
        errorData.error,
        errorData.code,
        response.status,
        errorData.timestamp
      );
    } catch {
      throw new IMDBRatingApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        "UNKNOWN_ERROR",
        response.status,
        new Date().toISOString()
      );
    }
  }

  return response.json();
}

// Error class for ratings
export class IMDBRatingApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public timestamp: string
  ) {
    super(message);
    this.name = "IMDBRatingApiError";
  }
}

// Types for API response (inlined for now)
export interface IMDBRatingData {
  tconst: string;
  average_rating: number | null;
  num_votes: number | null;
}

export interface IMDBRatingAPIResponse {
  data: IMDBRatingData;
  timestamp: string;
}

export interface IMDBRatingAPIErrorResponse {
  error: string;
  code: string;
  timestamp: string;
}

export const imdbRatingKeys = {
  all: ["imdb-rating"] as const,
  detail: (imdbId: string) => [...imdbRatingKeys.all, imdbId] as const,
} as const;

export function imdbRatingQueryOptions<TData = IMDBRatingAPIResponse>(
  imdbId: string | null | undefined,
  options?: Partial<UseQueryOptions<IMDBRatingAPIResponse, Error, TData>>
) {
  return {
    queryKey: imdbId ? imdbRatingKeys.detail(imdbId) : ["imdb-rating", "disabled"],
    queryFn: () => {
      if (!imdbId) {
        throw new Error("IMDB ID is required");
      }
      return getIMDBRating(imdbId);
    },
    enabled: !!imdbId,
    ...TMDB_CACHE.LONG,
    retry: (failureCount: number, error: Error) => {
      if (error instanceof IMDBRatingApiError) {
        return error.status < 500 ? false : failureCount < 3;
      }
      return failureCount < 3;
    },
    ...options,
  } satisfies UseQueryOptions<IMDBRatingAPIResponse, Error, TData>;
}

/**
 * Fetches IMDB rating data from our API using IMDB ID.
 * Returns average rating and number of votes from IMDB dataset.
 *
 * @template TData - The type of data returned (default: IMDBRatingAPIResponse).
 * @param imdbId - The IMDB ID (e.g., "tt1375666") to fetch rating data for.
 * @param options - Optional query options for react-query.
 * @returns A react-query useQuery result containing rating data.
 */
export function useIMDBRating<TData = IMDBRatingAPIResponse>(
  imdbId: string | null | undefined,
  options?: Partial<UseQueryOptions<IMDBRatingAPIResponse, Error, TData>>
) {
  const queryKey = imdbId ? imdbRatingKeys.detail(imdbId) : ["imdb-rating", "disabled"];
  return useQuery({
    queryKey,
    queryFn: () => {
      if (!imdbId) {
        throw new IMDBRatingApiError(
          "Invalid IMDB ID provided to useIMDBRating hook.",
          "INVALID_IMDB_ID",
          400,
          new Date().toISOString()
        );
      }
      return getIMDBRating(imdbId);
    },
    enabled: !!imdbId,
    ...TMDB_CACHE.LONG,
    retry: (failureCount, error) => {
      if (error instanceof IMDBRatingApiError) {
        return error.status < 500 ? false : failureCount < 3;
      }
      return failureCount < 3;
    },
    ...options,
  });
}

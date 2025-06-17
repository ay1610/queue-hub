import { tmdbFetcher } from "../fetcher";
import type { PopularTVShowsResponse } from "./types";

// TMDB TV API client

/**
 * Fetches popular TV shows from TMDB.
 *
 * @param page - The page number to fetch (default: 1).
 * @returns A promise resolving to the popular TV shows response.
 */
export async function getPopularTVShows(page: number = 1): Promise<PopularTVShowsResponse> {
  return tmdbFetcher<PopularTVShowsResponse>(`/tv/popular?page=${page}`);
}

// ...add TV API functions here...

export {};

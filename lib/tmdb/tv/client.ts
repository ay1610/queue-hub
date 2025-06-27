import { tmdbFetcher } from "../fetcher";
import type { TMDBTVShow } from "../types";
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

/**
 * Fetches trending TV shows from TMDB.
 *
 * @param page - The page number to fetch (default: 1).
 * @returns A promise resolving to the trending TV shows response.
 */
export async function getTrendingTVShows(page: number = 1): Promise<PopularTVShowsResponse> {
  return tmdbFetcher<PopularTVShowsResponse>(`/trending/tv/week?page=${page}`);
}

/**
 * Fetches detailed information for a single TV show by ID.
 * @param id - The TMDB TV show ID.
 * @returns A promise resolving to the TV show details.
 */
export async function getTVShowDetails(id: number): Promise<TMDBTVShow> {
  return tmdbFetcher<TMDBTVShow>(`/tv/${id}`);
}

// ...add TV API functions here...

export {};

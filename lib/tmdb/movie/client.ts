// TMDB Movie API client
import { tmdbFetcher } from "../fetcher";
import type { TrendingMoviesResponse } from "./types";

/**
 * Fetches trending movies from TMDB.
 *
 * @param page - The page number to fetch (default: 1).
 * @returns A promise resolving to the trending movies response.
 */
export async function getTrendingMovies(page: number = 1): Promise<TrendingMoviesResponse> {
  return tmdbFetcher<TrendingMoviesResponse>(`/movie/popular?page=${page}`);
}

export {};

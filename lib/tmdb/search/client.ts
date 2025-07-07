// TMDB Search API client
import { tmdbFetcher } from "../fetcher";
import type { DetailedMediaSearchResult, SearchMoviesResponse } from "@/lib/types/tmdb";

/**
 * Searches for movies on TMDB by query string.
 *
 * @param query - The search query string.
 * @param page - The page number to fetch (default: 1).
 * @returns A promise resolving to the search movies response.
 */
export async function searchMovies(query: string, page: number = 1): Promise<SearchMoviesResponse> {
  return tmdbFetcher<SearchMoviesResponse>(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
  );
}

export async function searchMedia(query: string, page = 1): Promise<DetailedMediaSearchResult> {
  return tmdbFetcher<DetailedMediaSearchResult>(
    `/search/multi?query=${encodeURIComponent(query)}&page=${page}`
  );
}

export {};

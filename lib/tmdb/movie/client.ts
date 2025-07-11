// TMDB Movie API client
import { tmdbFetcher } from "../fetcher";
import type { TrendingMoviesResponse, TMDBMovie } from "@/lib/types/tmdb";

/**
 * Fetches trending movies from TMDB.
 *
 * @param page - The page number to fetch (default: 1).
 * @returns A promise resolving to the trending movies response.
 */
export async function getTrendingMovies(page: number = 1): Promise<TrendingMoviesResponse> {
  return tmdbFetcher<TrendingMoviesResponse>(`/movie/popular?page=${page}`);
}

/**
 * Fetches detailed information for a single movie by ID.
 * @param id - The TMDB movie ID.
 * @param appendToResponse - Optional parameter to append additional data to the response.
 * @returns A promise resolving to the movie details.
 */
export async function getMovieDetails(id: number, appendToResponse?: string): Promise<TMDBMovie> {
  const url = appendToResponse
    ? `/movie/${id}?append_to_response=${appendToResponse}`
    : `/movie/${id}`;
  return tmdbFetcher<TMDBMovie>(url);
}

export {};

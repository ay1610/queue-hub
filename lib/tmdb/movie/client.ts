// TMDB Movie API client
import { tmdbFetcher } from "../fetcher";
import type { TrendingMoviesResponse } from "./types";
import type { TMDBMovie } from "../types";

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
 * @returns A promise resolving to the movie details.
 */
export async function getMovieDetails(id: number): Promise<TMDBMovie> {
  return tmdbFetcher<TMDBMovie>(`/movie/${id}`);
}

export {};

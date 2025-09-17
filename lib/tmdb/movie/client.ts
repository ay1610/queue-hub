import { validateMovieId, withMovieErrorHandling } from "../error-handling";
import type { TMDBTVExternalIds } from "@/lib/types/tmdb";
/**
 * Fetches external service IDs for a specific movie.
 * Returns identifiers used by other services like IMDb, Facebook, Twitter, etc.
 * @param id - The TMDB movie ID
 * @returns Promise resolving to object containing external service IDs
 */
export async function getMovieExternalIds(id: number): Promise<TMDBTVExternalIds> {
  validateMovieId(id);
  return withMovieErrorHandling(
    "fetch movie external IDs",
    { movieId: id, endpoint: `/movie/${id}/external_ids` },
    () => tmdbFetcher<TMDBTVExternalIds>(`/movie/${id}/external_ids`)
  );
}
// TMDB Movie API client
import { tmdbFetcher } from "../fetcher";
import type { TrendingMoviesResponse, TMDBMovie, TMDBGenre } from "@/lib/types/tmdb";

/**
 * Fetches trending movies from TMDB.
 *
 * @param page - The page number to fetch (default: 1).
 * @returns A promise resolving to the trending movies response.
 */
export async function getTrendingMovies(page: number = 1): Promise<TrendingMoviesResponse> {
  return tmdbFetcher<TrendingMoviesResponse>(
    `/trending/movie/week?page=${page}&include_adult=false`
  );
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

export async function getMovieGenres() {
  return tmdbFetcher<TMDBGenre[]>("/genre/movie/list");
}

export {};

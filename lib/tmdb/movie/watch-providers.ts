import { tmdbFetcher } from "../fetcher";
import type { WatchProvidersResponse } from "../types/watch-providers";

/**
 * Get watch provider data for a specific movie
 *
 * @endpoint GET /movie/{movie_id}/watch/providers
 * @see https://developer.themoviedb.org/reference/watch-providers-movie-list
 *
 * @param movieId - The ID of the movie
 * @returns Watch provider data by region
 */
export async function getMovieWatchProviders(movieId: number): Promise<WatchProvidersResponse> {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  return tmdbFetcher<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
}

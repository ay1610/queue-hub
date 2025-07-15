// Fetches videos (trailers, teasers, etc.) for a movie from TMDB
import { tmdbFetcher } from "../fetcher";
import type { TMDBVideosResponse } from "@/lib/types/tmdb";
import { validateMovieId, withMovieErrorHandling } from "../error-handling";

/**
 * Fetches promotional videos for a specific movie.
 *
 * Returns trailers, teasers, behind-the-scenes content, interviews,
 * and other promotional videos hosted on YouTube, Vimeo, and similar platforms.
 *
 * @param id - The TMDB movie ID (6-7 digit positive integer, e.g., 550 for Fight Club)
 * @returns Promise resolving to videos collection with metadata and embed keys
 * @throws {TMDBValidationError} When id is not a positive integer
 * @throws {TMDBNotFoundError} When movie doesn't exist (404)
 * @throws {TMDBMovieError} When API request fails or network issues occur
 *
 * @see {@link https://developers.themoviedb.org/3/movies/get-movie-videos}
 */
export async function getMovieVideos(id: number): Promise<TMDBVideosResponse> {
  validateMovieId(id);

  return withMovieErrorHandling(
    "fetch movie videos",
    { movieId: id, endpoint: `/movie/${id}/videos` },
    () => tmdbFetcher<TMDBVideosResponse>(`/movie/${id}/videos`)
  );
}

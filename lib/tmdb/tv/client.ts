import { tmdbFetcher } from "../fetcher";
import type {
  TMDBTVShow,
  PopularTVShowsResponse,
  TMDBGenre,
  TMDBTVExternalIds,
  TMDBVideosResponse,
} from "@/lib/types/tmdb";
import { validateTVShowId, validatePageNumber, withTVErrorHandling } from "../error-handling";

// TMDB TV API client

/**
 * Fetches popular TV shows currently trending on TMDB.
 *
 * Returns a paginated list of TV shows ordered by popularity score,
 * typically updated daily based on user engagement metrics.
 *
 * @param page - The page number to fetch (1-1000, defaults to 1)
 * @returns Promise resolving to paginated popular TV shows with metadata
 * @throws {TMDBValidationError} When page is not a positive integer
 * @throws {TMDBTVError} When API request fails or network issues occur
 *
 * @see {@link https://developers.themoviedb.org/3/tv/get-popular-tv-shows}
 */
export async function getPopularTVShows(page: number = 1): Promise<PopularTVShowsResponse> {
  validatePageNumber(page);

  return withTVErrorHandling("fetch popular TV shows", { page, endpoint: "/tv/popular" }, () =>
    tmdbFetcher<PopularTVShowsResponse>(`/tv/popular?page=${page}`)
  );
}

/**
 * Fetches TV shows trending this week on TMDB.
 *
 * Returns shows with the highest engagement over the past week,
 * including views, ratings, and social media mentions.
 *
 * @param page - The page number to fetch (1-1000, defaults to 1)
 * @returns Promise resolving to paginated trending TV shows with metadata
 * @throws {TMDBValidationError} When page is not a positive integer
 * @throws {TMDBTVError} When API request fails or network issues occur
 *
 * @see {@link https://developers.themoviedb.org/3/trending/get-trending}
 */
export async function getTrendingTVShows(page: number = 1): Promise<PopularTVShowsResponse> {
  validatePageNumber(page);

  return withTVErrorHandling(
    "fetch trending TV shows",
    { page, endpoint: "/trending/tv/week" },
    () => tmdbFetcher<PopularTVShowsResponse>(`/trending/tv/week?page=${page}`)
  );
}

/**
 * Fetches comprehensive details for a specific TV show.
 *
 * Returns complete show information including cast, crew, seasons,
 * episodes, ratings, and optional extended data via appendToResponse.
 *
 * @param id - The TMDB TV show ID (6-7 digit positive integer, e.g., 1399 for Game of Thrones)
 * @param appendToResponse - Optional comma-separated list of additional data to include:
 *   - `"videos"` - Trailers, teasers, and promotional videos
 *   - `"credits"` - Full cast and crew information
 *   - `"external_ids"` - IMDb, TVDb, and other external service IDs
 *   - `"images"` - Posters, backdrops, and still images
 *   - `"recommendations"` - Similar shows recommendations
 *   - `"reviews"` - User reviews and ratings
 *   - Multiple values: `"videos,credits,external_ids"`
 * @returns Promise resolving to comprehensive TV show data
 * @throws {TMDBValidationError} When id is not a positive integer
 * @throws {TMDBNotFoundError} When TV show doesn't exist (404)
 * @throws {TMDBTVError} When API request fails or network issues occur
 *
 * @see {@link https://developers.themoviedb.org/3/tv/get-tv-details}
 */
export async function getTVShowDetails(id: number, appendToResponse?: string): Promise<TMDBTVShow> {
  validateTVShowId(id);

  const endpoint = appendToResponse
    ? `/tv/${id}?append_to_response=${appendToResponse}`
    : `/tv/${id}`;

  return withTVErrorHandling(
    "fetch TV show details",
    { tvShowId: id, appendToResponse, endpoint },
    () => tmdbFetcher<TMDBTVShow>(endpoint)
  );
}

/**
 * Fetches the complete list of official TV show genres from TMDB.
 *
 * Returns all available genre classifications used for TV show categorization,
 * typically stable data that can be cached for extended periods.
 *
 * @returns Promise resolving to array of genre objects with id and name
 * @throws {TMDBTVError} When API request fails or network issues occur
 *
 * @see {@link https://developers.themoviedb.org/3/genres/get-tv-list}
 */
export async function getTVGenres(): Promise<TMDBGenre[]> {
  return withTVErrorHandling("fetch TV genres", { endpoint: "/genre/tv/list" }, () =>
    tmdbFetcher<TMDBGenre[]>("/genre/tv/list")
  );
}

/**
 * Fetches external service IDs for a specific TV show.
 *
 * Returns identifiers used by other services like IMDb, TVDb, Facebook,
 * Twitter, and Wikipedia for cross-referencing and deep linking.
 *
 * @param id - The TMDB TV show ID (6-7 digit positive integer)
 * @returns Promise resolving to object containing external service IDs
 * @throws {TMDBValidationError} When id is not a positive integer
 * @throws {TMDBNotFoundError} When TV show doesn't exist (404)
 * @throws {TMDBTVError} When API request fails or network issues occur
 *
 * @see {@link https://developers.themoviedb.org/3/tv/get-tv-external-ids}
 */
export async function getTVShowExternalIds(id: number): Promise<TMDBTVExternalIds> {
  validateTVShowId(id);

  return withTVErrorHandling(
    "fetch TV show external IDs",
    { tvShowId: id, endpoint: `/tv/${id}/external_ids` },
    () => tmdbFetcher<TMDBTVExternalIds>(`/tv/${id}/external_ids`)
  );
}

/**
 * Fetches promotional videos for a specific TV show.
 *
 * Returns trailers, teasers, behind-the-scenes content, and other
 * promotional videos hosted on YouTube, Vimeo, and other platforms.
 *
 * @param id - The TMDB TV show ID (6-7 digit positive integer)
 * @returns Promise resolving to videos collection with metadata
 * @throws {TMDBValidationError} When id is not a positive integer
 * @throws {TMDBNotFoundError} When TV show doesn't exist (404)
 * @throws {TMDBTVError} When API request fails or network issues occur
 *
 * @see {@link https://developers.themoviedb.org/3/tv/get-tv-videos}
 */
export async function getTVShowVideos(id: number): Promise<TMDBVideosResponse> {
  validateTVShowId(id);

  return withTVErrorHandling(
    "fetch TV show videos",
    { tvShowId: id, endpoint: `/tv/${id}/videos` },
    () => tmdbFetcher<TMDBVideosResponse>(`/tv/${id}/videos`)
  );
}

// ...add TV API functions here...

export {};

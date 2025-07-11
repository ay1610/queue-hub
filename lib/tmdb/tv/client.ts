import { tmdbFetcher } from "../fetcher";
import type { TMDBTVShow, PopularTVShowsResponse, TMDBGenre } from "@/lib/types/tmdb";

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
export async function getTVShowDetails(id: number, appendToResponse?: string): Promise<TMDBTVShow> {
  const url = appendToResponse ? `/tv/${id}?append_to_response=${appendToResponse}` : `/tv/${id}`;
  return tmdbFetcher<TMDBTVShow>(url);
}

/**
 * Fetches the list of TV genres from TMDB.
 *
 * @returns A promise resolving to the list of TV genres.
 */
export async function getTVGenres(): Promise<TMDBGenre[]> {
  return tmdbFetcher<TMDBGenre[]>("/genre/tv/list");
}

// ...add TV API functions here...

export {};

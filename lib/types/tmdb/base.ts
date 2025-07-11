/**
 * Base response structure for TMDB API paginated results
 */
export interface TMDBBaseResponse {
  page: number;
  total_pages: number;
  total_results: number;
}

/**
 * Common properties shared between movies and TV shows
 */
export interface TMDBMediaBase {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  type: "movie" | "tv"; // Added for compatibility
}

/**
 * Media types supported by TMDB API
 */
export type TMDBMediaType = "movie" | "tv" | "person" | "all";

/**
 * Time window options for trending endpoints
 */
export type TMDBTimeWindow = "day" | "week";

/**
 * Poster image size options
 */
export type TMDBImageSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";

/**
 * Backdrop image size options
 */
export type TMDBBackdropSize = "w300" | "w780" | "w1280" | "original";

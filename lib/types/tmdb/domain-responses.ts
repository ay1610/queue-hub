import { TMDBSearchResponse } from "../tmdb/responses";
import { TMDBMovie, TMDBTVShow } from "../tmdb/media";

/**
 * Response for trending movies endpoint
 */
export type TrendingMoviesResponse = TMDBSearchResponse<TMDBMovie>;

/**
 * Response for trending TV shows endpoint
 */
export type TrendingTVShowsResponse = TMDBSearchResponse<TMDBTVShow>;

/**
 * Response for popular TV shows endpoint
 */
export type PopularTVShowsResponse = TMDBSearchResponse<TMDBTVShow>;

/**
 * Response for search movies endpoint
 */
export type SearchMoviesResponse = TMDBSearchResponse<TMDBMovie>;

/**
 * Detailed media search result with mixed movie and TV fields
 */
export interface DetailedMediaSearchResult {
  page: number;
  results: Array<{
    adult: boolean;
    backdrop_path: string;
    id: number;
    title?: string; // Movie-specific
    name?: string; // TV-specific
    original_title?: string; // Movie-specific
    original_name?: string; // TV-specific
    overview: string;
    poster_path: string;
  }>;
}

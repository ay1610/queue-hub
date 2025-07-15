/**
 * TMDB Video API types
 * Consolidated location for all video-related type definitions
 */

/**
 * Represents a video (trailer, teaser, etc.) from TMDB
 */
export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

/**
 * Response structure for TMDB videos endpoint
 */
export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

/**
 * External IDs for TMDB TV shows
 */
export interface TMDBTVExternalIds {
  imdb_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

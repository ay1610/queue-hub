import type { TMDBMovie, TMDBBaseResponse } from "@/lib/types/tmdb";

// Types for TMDB Search API
export interface SearchMoviesResponse extends TMDBBaseResponse {
  results: TMDBMovie[];
}

// Updated the DetailedSearchMoviesResponse type to include TV-specific and Movie-specific fields
export interface DetailedMediaSearchResult {
  page: number; // Defaults to 0
  results: Array<{
    adult: boolean; // Defaults to true
    backdrop_path: string;
    id: number; // Defaults to 0
    title?: string; // Movie-specific
    name?: string; // TV-specific
    original_title?: string; // Movie-specific
    original_name?: string; // TV-specific
    overview: string;
    poster_path: string;
    media_type: string;
    original_language: string;
    genre_ids: number[];
    popularity: number; // Defaults to 0
    release_date?: string; // Movie-specific
    first_air_date?: string; // TV-specific
    video?: boolean; // Defaults to true, Movie-specific
    vote_average: number; // Defaults to 0
    vote_count: number; // Defaults to 0
    origin_country?: string[]; // TV-specific
  }>;
  total_pages: number; // Defaults to 0
  total_results: number; // Defaults to 0
}

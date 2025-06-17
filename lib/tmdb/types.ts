// TMDB API Response Types
export interface TMDBBaseResponse {
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  genre_ids: number[];
  // Detailed movie properties (when fetching individual movie)
  runtime?: number;
  genres?: TMDBGenre[];
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  production_companies?: TMDBProductionCompany[];
  production_countries?: TMDBProductionCountry[];
  spoken_languages?: TMDBSpokenLanguage[];
  imdb_id?: string;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  last_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  origin_country: string[];
  // Detailed TV show properties (when fetching individual show)
  number_of_episodes?: number;
  number_of_seasons?: number;
  genres?: TMDBGenre[];
  created_by?: TMDBCreatedBy[];
  episode_run_time?: number[];
  in_production?: boolean;
  networks?: TMDBNetwork[];
  production_companies?: TMDBProductionCompany[];
  production_countries?: TMDBProductionCountry[];
  spoken_languages?: TMDBSpokenLanguage[];
  status?: string;
  tagline?: string;
  type?: string;
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
  known_for: (TMDBMovie | TMDBTVShow)[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBCreatedBy {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string | null;
}

export interface TMDBNetwork {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBSearchResponse<T> extends TMDBBaseResponse {
  results: T[];
}

export interface TMDBDiscoverResponse<T> extends TMDBBaseResponse {
  results: T[];
}

export type TMDBMediaType = "movie" | "tv" | "person" | "all";
export type TMDBTimeWindow = "day" | "week";
export type TMDBImageSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
export type TMDBBackdropSize = "w300" | "w780" | "w1280" | "original";

// Search and Discovery filters
export interface TMDBMovieFilters {
  page?: number;
  language?: string;
  region?: string;
  sort_by?: "popularity.desc" | "popularity.asc" | "release_date.desc" | "release_date.asc" | "vote_average.desc" | "vote_average.asc" | "vote_count.desc" | "vote_count.asc";
  include_adult?: boolean;
  include_video?: boolean;
  primary_release_year?: number;
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  release_date_gte?: string;
  release_date_lte?: string;
  with_release_type?: number;
  year?: number;
  vote_count_gte?: number;
  vote_count_lte?: number;
  vote_average_gte?: number;
  vote_average_lte?: number;
  with_cast?: string;
  with_crew?: string;
  with_people?: string;
  with_companies?: string;
  with_genres?: string;
  without_genres?: string;
  with_keywords?: string;
  without_keywords?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  with_original_language?: string;
}

export interface TMDBTVFilters {
  page?: number;
  language?: string;
  sort_by?: "popularity.desc" | "popularity.asc" | "first_air_date.desc" | "first_air_date.asc" | "vote_average.desc" | "vote_average.asc" | "vote_count.desc" | "vote_count.asc";
  first_air_date_year?: number;
  first_air_date_gte?: string;
  first_air_date_lte?: string;
  timezone?: string;
  vote_average_gte?: number;
  vote_count_gte?: number;
  with_genres?: string;
  with_networks?: string;
  without_genres?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  include_null_first_air_dates?: boolean;
  with_original_language?: string;
  without_keywords?: string;
  screened_theatrically?: boolean;
  with_companies?: string;
  with_keywords?: string;
}

// API Error types
export interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}

export interface TMDBAPIError extends Error {
  status?: number;
  code?: string;
  response?: TMDBError;
}

// Configuration response type
export interface TMDBConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

/**
 * Base filter options common between movie and TV filters
 */
export interface TMDBBaseFilters {
  page?: number;
  language?: string;
  vote_average_gte?: number;
  vote_count_gte?: number;
  with_genres?: string;
  without_genres?: string;
  with_keywords?: string;
  without_keywords?: string;
  with_companies?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  with_original_language?: string;
}

/**
 * Filter options for movie discovery and search
 */
export interface TMDBMovieFilters extends TMDBBaseFilters {
  region?: string;
  sort_by?:
    | "popularity.desc"
    | "popularity.asc"
    | "release_date.desc"
    | "release_date.asc"
    | "vote_average.desc"
    | "vote_average.asc"
    | "vote_count.desc"
    | "vote_count.asc";
  include_adult?: boolean;
  include_video?: boolean;
  primary_release_year?: number;
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  release_date_gte?: string;
  release_date_lte?: string;
  with_release_type?: number;
  year?: number;
  vote_count_lte?: number;
  with_cast?: string;
  with_crew?: string;
  with_people?: string;
}

/**
 * Filter options for TV show discovery and search
 */
export interface TMDBTVFilters extends TMDBBaseFilters {
  sort_by?:
    | "popularity.desc"
    | "popularity.asc"
    | "first_air_date.desc"
    | "first_air_date.asc"
    | "vote_average.desc"
    | "vote_average.asc"
    | "vote_count.desc"
    | "vote_count.asc";
  first_air_date_year?: number;
  first_air_date_gte?: string;
  first_air_date_lte?: string;
  timezone?: string;
  with_networks?: string;
  include_null_first_air_dates?: boolean;
  screened_theatrically?: boolean;
}

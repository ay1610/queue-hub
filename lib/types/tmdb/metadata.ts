/**
 * Represents a genre in TMDB
 */
export interface TMDBGenre {
  id: number;
  name: string;
}

/**
 * Represents a production company
 */
export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

/**
 * Represents a production country
 */
export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

/**
 * Represents a spoken language
 */
export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

/**
 * Represents a creator of a TV show
 */
export interface TMDBCreatedBy {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string | null;
}

/**
 * Represents a TV network
 */
export interface TMDBNetwork {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

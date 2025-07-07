import { TMDBMediaBase } from "./base";
import {
  TMDBGenre,
  TMDBProductionCompany,
  TMDBProductionCountry,
  TMDBSpokenLanguage,
  TMDBCreatedBy,
  TMDBNetwork,
} from "./metadata";

/**
 * Represents a movie from TMDB API
 */
export interface TMDBMovie extends TMDBMediaBase {
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
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

/**
 * Represents a TV show from TMDB API
 */
export interface TMDBTVShow extends TMDBMediaBase {
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date?: string;
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

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
  type: "movie"; // Added for compatibility
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
  watchProviders?: {
    results: {
      [country: string]: {
        link: string;
        flatrate?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
          display_priority: number;
        }>;
        rent?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
          display_priority: number;
        }>;
        buy?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
          display_priority: number;
        }>;
      };
    };
  };
}

/**
 * Represents a TV show from TMDB API
 */
export interface TMDBTVShow extends TMDBMediaBase {
  type: "tv"; // Fixed for compatibility
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date?: string;
  origin_country: string[];
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
  watchProviders?: {
    results: {
      [country: string]: {
        link: string;
        flatrate?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
          display_priority: number;
        }>;
        rent?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
          display_priority: number;
        }>;
        buy?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
          display_priority: number;
        }>;
      };
    };
  };
}

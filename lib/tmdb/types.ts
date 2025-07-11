/**
 * @deprecated Use types from "@/lib/types/tmdb" instead
 * This file is kept for backward compatibility and will be removed in a future version.
 */

export * from "@/lib/types/tmdb";
import {
  TMDBProductionCompany,
  TMDBProductionCountry,
  TMDBCreatedBy,
} from "../types/tmdb/metadata";
import { WatchProvider } from "./movie/watchProviders";

// Define TMDBGenre type
export interface TMDBGenre {
  id: number;
  name: string;
}

// Define TMDBTVShow type
export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  genres: TMDBGenre[];
  trailer?: string;
  usProviders?: {
    link?: string;
    flatrate?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
    rent?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
    buy?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
  };
  title?: string; // Added for compatibility
  original_title?: string; // Added for compatibility
  release_date?: string; // Added for compatibility
  video?: boolean; // Added for compatibility
  backdrop_path?: string; // Added for compatibility
  poster_path?: string; // Added for compatibility
  vote_average?: number; // Added for compatibility
  popularity?: number; // Added for compatibility
  status?: string; // Added for compatibility
  number_of_seasons?: number; // Added for compatibility
  number_of_episodes?: number; // Added for compatibility
}

// Define and export MediaDetails type
export type MediaDetails = {
  id: number;
  title?: string; // Add for movie compatibility
  name?: string;  // Add for TV compatibility
  tagline?: string;
  overview: string;
  genres?: TMDBGenre[];
  production_companies?: TMDBProductionCompany[];
  production_countries?: TMDBProductionCountry[];
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  trailer?: string;
  usProviders?: {
    link: string;
    flatrate?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
  } | null;
  watchProviders?: {
    results: {
      [country: string]: {
        link: string;
        flatrate?: WatchProvider[];
        rent?: WatchProvider[];
        buy?: WatchProvider[];
        free?: WatchProvider[];
        ads?: WatchProvider[];
      };
    };
  };
  // Add this for TMDB API compatibility
  "watch/providers"?: {
    results: {
      [country: string]: {
        link: string;
        flatrate?: WatchProvider[];
        rent?: WatchProvider[];
        buy?: WatchProvider[];
        free?: WatchProvider[];
        ads?: WatchProvider[];
      };
    };
  };
} & (
  | {
      type: "movie";
      title: string;
      original_title: string;
      release_date: string;
      video: boolean;
    }
  | {
      type: "tv";
      name: string;
      original_name: string;
      first_air_date: string;
      last_air_date?: string;
      origin_country: string[];
      number_of_episodes?: number;
      number_of_seasons?: number;
      created_by?: TMDBCreatedBy[];
      episode_run_time?: number[];
    }
);

export type { TMDBVideo } from "./movie/videos";

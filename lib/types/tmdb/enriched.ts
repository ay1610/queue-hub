import type { TMDBMovie } from "./media";

/**
 * Enriched movie data with IMDB runtime and ratings information
 * Used for server-side data fetching where additional data is pre-loaded
 */
export interface EnrichedMovieData extends TMDBMovie {
  // IMDB runtime data (renamed to avoid conflict with TMDBMovie.runtime)
  imdbRuntime?: {
    tconst: string;
    title_type: string | null;
    primary_title: string | null;
    runtime_minutes: number | null;
  };
  // IMDB rating data
  imdbRating?: {
    tconst: string;
    averageRating: number | null;
    numVotes: number | null;
  };
}

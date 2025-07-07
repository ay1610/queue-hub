import { TMDBMovie, TMDBTVShow } from "./media";

/**
 * Represents a person (actor, director, etc.) from TMDB API
 */
export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
  known_for: (TMDBMovie | TMDBTVShow)[];
}

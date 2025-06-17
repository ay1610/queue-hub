import type { TMDBMovie, TMDBBaseResponse } from "../types";

// Types for TMDB Search API
export interface SearchMoviesResponse extends TMDBBaseResponse {
  results: TMDBMovie[];
}
export {};

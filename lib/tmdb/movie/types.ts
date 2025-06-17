import type { TMDBMovie, TMDBBaseResponse } from "../types";

// Types for TMDB Movie API

export interface TrendingMoviesResponse extends TMDBBaseResponse {
  results: TMDBMovie[];
}

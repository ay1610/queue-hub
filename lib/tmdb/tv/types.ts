import type { TMDBTVShow, TMDBBaseResponse } from "@/lib/types/tmdb";

// Types for TMDB TV API

export interface PopularTVShowsResponse extends TMDBBaseResponse {
  results: TMDBTVShow[];
}

export interface TrendingTVShowsResponse extends TMDBBaseResponse {
  results: TMDBTVShow[];
}

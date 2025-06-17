import type { TMDBTVShow, TMDBBaseResponse } from "../types";

// Types for TMDB TV API

export interface PopularTVShowsResponse extends TMDBBaseResponse {
  results: TMDBTVShow[];
}

import { TMDBBaseResponse } from "./base";

/**
 * Generic response structure for search endpoints
 */
export interface TMDBSearchResponse<T> extends TMDBBaseResponse {
  results: T[];
}

/**
 * Generic response structure for discover endpoints
 */
export interface TMDBDiscoverResponse<T> extends TMDBBaseResponse {
  results: T[];
}

import type { TMDBPerson, TMDBBaseResponse } from "../types";

// Types for TMDB Person API
export interface PopularPeopleResponse extends TMDBBaseResponse {
  results: TMDBPerson[];
}
export {};

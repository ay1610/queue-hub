import type { TMDBPerson, TMDBBaseResponse } from "@/lib/types/tmdb";

// Types for TMDB Person API
export interface PopularPeopleResponse extends TMDBBaseResponse {
  results: TMDBPerson[];
}
export {};

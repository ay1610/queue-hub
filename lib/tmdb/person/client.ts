// TMDB Person API client
import { tmdbFetcher } from "../fetcher";
import type { PopularPeopleResponse } from "./types";

/**
 * Fetches popular people from TMDB.
 *
 * @param page - The page number to fetch (default: 1).
 * @returns A promise resolving to the popular people response.
 */
export async function getPopularPeople(page: number = 1): Promise<PopularPeopleResponse> {
  return tmdbFetcher<PopularPeopleResponse>(`/person/popular?page=${page}`);
}

export {};

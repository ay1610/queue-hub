import { tmdbFetcher } from "./fetcher";
import { TMDBError } from "@/lib/tmdb/types";
import type { TMDBRegion, TMDBRegionsResponse } from "@/lib/tmdb/types/regions";

/**
 * Fetches the list of countries that have watch provider (OTT/streaming) data in TMDB
 * 
 * @endpoint GET /watch/providers/regions
 * @see https://developer.themoviedb.org/reference/watch-providers-available-regions
 * 
 * @throws {TMDBError} When the API request fails
 * @returns {Promise<TMDBRegion[]>} List of available regions with their ISO codes and names

 */
export async function getAvailableRegions(): Promise<TMDBRegion[]> {
  const response = await tmdbFetcher<TMDBRegionsResponse>("/watch/providers/regions");

  return response.results.sort((a: TMDBRegion, b: TMDBRegion) =>
    // Sort alphabetically by English name
    a.english_name.localeCompare(b.english_name)
  );
}

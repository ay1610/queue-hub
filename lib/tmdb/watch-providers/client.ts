import { tmdbFetcher } from "../fetcher";
import type { TMDBError } from "@/lib/types/tmdb";
import type { TMDBRegionsResponse } from "@/lib/tmdb/types/regions";

/**
 * Get the list of countries we have watch provider (OTT/streaming) data for.
 *
 * @endpoint GET /3/watch/providers/regions
 * @see https://developer.themoviedb.org/reference/watch-providers-available-regions
 *
 * @throws {TMDBError} When the API request fails
 * @returns {Promise<TMDBRegionsResponse>} List of available regions
 */
export async function getWatchProviderRegions(): Promise<TMDBRegionsResponse> {
  const data = await tmdbFetcher<TMDBRegionsResponse>("/watch/providers/regions");
  return data;
}

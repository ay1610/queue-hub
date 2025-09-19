import { tmdbFetcher } from "../fetcher";
import type { WatchProvidersResponse } from "../types/watch-providers";

/**
 * Get watch provider data for a specific TV show
 *
 * @endpoint GET /tv/{tv_id}/watch/providers
 * @see https://developer.themoviedb.org/reference/watch-provider-tv-list
 *
 * @param tvId - The ID of the TV show
 * @returns Watch provider data by region
 */
export async function getTVWatchProviders(tvId: number): Promise<WatchProvidersResponse> {
  if (!tvId) {
    throw new Error("TV show ID is required");
  }

  return tmdbFetcher<WatchProvidersResponse>(`/tv/${tvId}/watch/providers`);
}

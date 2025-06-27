// TMDB: Get where to watch providers for a movie
import { tmdbFetcher } from "../fetcher";

export interface WatchProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface WatchProvidersResponse {
  id: number;
  results: {
    [country: string]: {
      link: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

/**
 * Fetches where-to-watch providers for a movie by ID.
 * @param id - The TMDB movie ID.
 * @returns A promise resolving to the watch providers response.
 */
export async function getMovieWatchProviders(id: number): Promise<WatchProvidersResponse> {
  return tmdbFetcher<WatchProvidersResponse>(`/movie/${id}/watch/providers`);
}

// Fetches videos (trailers, teasers, etc.) for a TV show from TMDB
import { tmdbFetcher } from "../fetcher";

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

/**
 * Fetches videos for a TV show by TMDB ID.
 * @param id - The TMDB TV show ID.
 * @returns A promise resolving to the videos response.
 */
export async function getTVShowVideos(id: number): Promise<TMDBVideosResponse> {
  return tmdbFetcher<TMDBVideosResponse>(`/tv/${id}/videos`);
}

// Fetches videos (trailers, teasers, etc.) for a movie from TMDB
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
 * Fetches videos for a movie by TMDB ID.
 * @param id - The TMDB movie ID.
 * @returns A promise resolving to the videos response.
 */
export async function getMovieVideos(id: number): Promise<TMDBVideosResponse> {
  return tmdbFetcher<TMDBVideosResponse>(`/movie/${id}/videos`);
}

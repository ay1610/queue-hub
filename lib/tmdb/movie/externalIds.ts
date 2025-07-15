// Fetches external IDs (IMDB, Wikidata, etc.) for a movie from TMDB
import { tmdbFetcher } from "../fetcher";

export interface TMDBExternalIds {
  imdb_id: string | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

/**
 * Fetches external IDs for a movie by TMDB ID.
 * @param id - The TMDB movie ID.
 * @returns A promise resolving to the external IDs response.
 */
export async function getMovieExternalIds(id: number): Promise<TMDBExternalIds> {
  return tmdbFetcher<TMDBExternalIds>(`/movie/${id}/external_ids`);
}

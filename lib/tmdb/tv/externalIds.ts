// Fetches external IDs (IMDB, Wikidata, etc.) for a TV show from TMDB
import { tmdbFetcher } from "../fetcher";

export interface TMDBTVExternalIds {
  imdb_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvdb_id: number | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

/**
 * Fetches external IDs for a TV show by TMDB ID.
 * @param id - The TMDB TV show ID.
 * @returns A promise resolving to the external IDs response.
 */
export async function getTVShowExternalIds(id: number): Promise<TMDBTVExternalIds> {
  return tmdbFetcher<TMDBTVExternalIds>(`/tv/${id}/external_ids`);
}

import { TMDBMovie, TMDBTVShow } from "@/lib/types/tmdb";
import { tmdbFetcher } from "./fetcher";

type SearchResult = {
  results: Array<TMDBMovie | TMDBTVShow>;
};

/**
 * Searches for movies or TV shows using the TMDB API.
 * @param query - The search query string.
 * @returns A promise resolving to the search results.
 */
export async function searchTMDB(query: string): Promise<SearchResult> {
  if (!query) {
    throw new Error("Search query cannot be empty");
  }

  const endpoint = `/search/multi?query=${encodeURIComponent(query)}`;
  return tmdbFetcher<SearchResult>(endpoint);
}

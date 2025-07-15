import { TMDBGenre } from "@/lib/tmdb/types";
import { WatchProvider, WatchProvidersResponse } from "@/lib/tmdb/movie/watchProviders";

/**
 * Filters and maps genres from details to TV genres.
 * @param detailsGenres - Genres from media details
 * @param tvGenres - Genres from TV genre list
 */
export function getFilteredGenres(
  detailsGenres?: TMDBGenre[],
  tvGenres?: TMDBGenre[] | { genres: TMDBGenre[] }
): TMDBGenre[] {
  if (!detailsGenres) return [];
  const genresArray: TMDBGenre[] = Array.isArray(tvGenres)
    ? tvGenres
    : tvGenres && "genres" in tvGenres
      ? (tvGenres as { genres: TMDBGenre[] }).genres
      : [];
  return detailsGenres.map(
    (genre: TMDBGenre) => genresArray.find((tvGenre: TMDBGenre) => tvGenre.id === genre.id) || genre
  );
}

/**
 * Extracts US provider info from watch/providers response.
 * @param providers - The watch/providers object from details
 */
export function getUSProviders(providers?: WatchProvidersResponse):
  | {
      link?: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    }
  | undefined {
  const rawProviders = providers?.results?.US;
  if (!rawProviders) return undefined;
  return {
    link: rawProviders.link,
    flatrate: rawProviders.flatrate as WatchProvider[],
    rent: rawProviders.rent as WatchProvider[],
    buy: rawProviders.buy as WatchProvider[],
  };
}

/**
 * Converts runtime in minutes to a human-readable string (e.g., "2h 15m").
 * Returns "N/A" for null or negative input.
 *
 * @param runtimeMins - The runtime in minutes (non-negative integer or null)
 * @returns Formatted string in "Xh Ym", "Xh", "Ym", or "N/A" if input is invalid
 */
export function getFormattedRuntime(runtimeMins: number | null): string {
  if (runtimeMins === null || runtimeMins < 0) return "N/A";
  const hours = Math.floor(runtimeMins / 60);
  const minutes = runtimeMins % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

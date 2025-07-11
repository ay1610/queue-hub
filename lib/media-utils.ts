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

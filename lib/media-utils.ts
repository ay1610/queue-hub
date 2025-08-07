/**
 * Formats runtime and provides a badge indicating if it's "Short" or "Long" based on media type.
 * UX: Returns badge label and color for clear, accessible distinction. No badge for typical runtimes.
 * @param runtimeMins - Runtime in minutes
 * @param mediaType - 'movie' | 'tv'
 * @returns { formatted: string, badge: { label: string; color: string } | null }
 */
export function getFormattedRuntimeWithBadge(
  runtimeMins: number | null,
  mediaType: "movie" | "tv"
): { formatted: string; badge: { label: string; color: string } | null } {
  const formatted = getFormattedRuntime(runtimeMins);
  if (runtimeMins === null || runtimeMins < 0) {
    return { formatted, badge: null };
  }
  let badge: { label: string; color: string } | null = null;
  if (mediaType === "movie") {
    if (runtimeMins < 90) badge = { label: "Short", color: "green" };
    else if (runtimeMins > 150) badge = { label: "Long", color: "red" };
  }
  if (mediaType === "tv") {
    if (runtimeMins < 30) badge = { label: "Short", color: "green" };
    else if (runtimeMins > 60) badge = { label: "Long", color: "red" };
  }
  return { formatted, badge };
}
/**
 * Returns the display title for a media item (movie or TV show).
 * Falls back to name if title is not present.
 * @param media The media object
 */
export function getMediaTitle(media: { title?: string; name?: string }): string {
  return media.title || media.name || "";
}
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

/**
 * Returns a string of genre names for a media item, or 'Unknown Genre' if not found.
 * @param media The media object (movie or tv show)
 * @param type 'movie' | 'tv'
 * @param movieGenreData List of movie genres (optional)
 * @param tvGenreData List of tv genres (optional)
 */
export function getMediaGenre(
  media: { genres?: { id: number; name: string }[]; genre_ids?: number[] },
  type: "movie" | "tv",
  movieGenreData?: { id: number; name: string }[],
  tvGenreData?: { id: number; name: string }[]
): string {
  let derivedGenreIds = media.genre_ids;
  if (media.genres && media.genres.length > 0) {
    const mappedGenres: { id: number; name: string }[] = getFilteredGenres(
      media.genres,
      type === "movie" ? movieGenreData : tvGenreData
    );
    if (mappedGenres.length) {
      derivedGenreIds = mappedGenres.map((g: { id: number }) => g.id);
    }
  }
  if (derivedGenreIds?.length) {
    const genreData = type === "movie" ? movieGenreData : type === "tv" ? tvGenreData : undefined;
    if (!genreData) return "Unknown Genre";
    const mappedGenres: { id: number; name: string }[] = getFilteredGenres(
      derivedGenreIds.map((id) => ({ id, name: "" })),
      genreData
    );
    return mappedGenres.length
      ? mappedGenres.map((g: { name: string }) => g.name).join(", ")
      : "Unknown Genre";
  }
  return "Unknown Genre";
}

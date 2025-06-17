import { tmdbClient } from "./client";
import type { TMDBImageSize, TMDBBackdropSize } from "./types";

/**
 * Helper to get TMDB image URL.
 * @param path - The image path from TMDB.
 * @param size - The image size (default: w500).
 * @returns The full image URL or an empty string if no path.
 */
export function getImageUrl(path: string | null, size: TMDBImageSize = "w500"): string {
  return path ? tmdbClient.getImageUrl(path, size) ?? "" : "";
}

/**
 * Helper to get TMDB backdrop image URL.
 * @param path - The backdrop image path from TMDB.
 * @param size - The backdrop size (default: w780).
 * @returns The full backdrop image URL or an empty string if no path.
 */
export function getBackdropUrl(path: string | null, size: TMDBBackdropSize = "w780"): string {
  return path ? tmdbClient.getBackdropUrl(path, size) ?? "" : "";
}

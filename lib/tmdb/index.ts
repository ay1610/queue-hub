// Export all types
export * from "./types";

// Export the client
export { tmdbClient, default as TMDBClient } from "./client";

// Export all hooks
export * from "./hooks";

// Import client for utility object
import { tmdbClient } from "./client";

// Re-export commonly used utilities
export const tmdb = {
  client: tmdbClient,
  getImageUrl: (
    path: string | null,
    size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
  ) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },
  getBackdropUrl: (path: string | null, size: "w300" | "w780" | "w1280" | "original" = "w1280") => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },
};

export * as movie from "./movie/client";
export * as tv from "./tv/client";
export * as person from "./person/client";
export * as search from "./search/client";

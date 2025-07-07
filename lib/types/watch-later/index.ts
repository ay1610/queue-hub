/**
 * Media types for watch later functionality
 */
export type WatchLaterMediaType = "movie" | "tv";

/**
 * Represents an item in the watch later list
 */
export interface WatchLaterItem {
  mediaId: number;
  mediaType: WatchLaterMediaType;
}

/**
 * Response structure for watch later API calls
 */
export interface WatchLaterResponse {
  success: boolean;
  data: WatchLaterItem[];
}

/**
 * Parameters for watch later mutation actions
 */
export interface WatchLaterMutationParams {
  mediaId: number;
  mediaType: WatchLaterMediaType;
  action: "add" | "remove";
}

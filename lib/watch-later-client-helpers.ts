/**
 * Client-side watch-later helper functions
 * (No server-only imports like next/headers)
 */
import { WatchLaterItem, WatchLaterMediaType } from "./types/watch-later";

export function isInWatchLater(
  watchLaterList: WatchLaterItem[],
  mediaId: number,
  mediaType: WatchLaterMediaType
): boolean {
  return watchLaterList.some((item) => item.mediaId === mediaId && item.mediaType === mediaType);
}

export function createWatchLaterLookup(watchLaterList: WatchLaterItem[]) {
  return watchLaterList.reduce(
    (lookup, item) => {
      lookup[`${item.mediaId}-${item.mediaType}`] = true;
      return lookup;
    },
    {} as Record<string, boolean>
  );
}

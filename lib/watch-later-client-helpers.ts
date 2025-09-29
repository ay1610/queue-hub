/**
 * Client-side watch-later helper functions
 * (No server-only imports like next/headers)
 */
import { WatchLaterItem, WatchLaterMediaType } from "./types/watch-later";
import { buildKey } from "@/lib/watch-later-utils";

export function isInWatchLater(
  watchLaterList: WatchLaterItem[],
  mediaId: number,
  mediaType: WatchLaterMediaType
): boolean {
  return watchLaterList.some((item) => item.mediaId === mediaId && item.mediaType === mediaType);
}

export function createWatchLaterLookup(watchLaterList: WatchLaterItem[]): Set<string> {
  const s = new Set<string>();
  for (const item of watchLaterList) {
    s.add(buildKey(item.mediaId, item.mediaType));
  }
  return s;
}

import type { WatchLaterItem, WatchLaterMediaType } from "@/lib/types/watch-later";

/**
 * Build the unique key for a watch-later entry
 * Format: `${mediaId}-${mediaType}`
 */
export function buildKey(mediaId: number, mediaType: WatchLaterMediaType): string {
  return `${mediaId}-${mediaType}`;
}

/**
 * Convert a list of watch-later items into a Set of lookup keys.
 */
export function toLookup(list: WatchLaterItem[]): Set<string> {
  const watchLaterSet = new Set<string>();
  for (const item of list) {
    watchLaterSet.add(buildKey(item.mediaId, item.mediaType));
  }
  return watchLaterSet;
}

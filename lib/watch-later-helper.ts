import { headers } from "next/headers";
import { WatchLaterItem } from "./types/watch-later";
import { buildKey } from "@/lib/watch-later-utils";

export async function getWatchLaterList(): Promise<WatchLaterItem[]> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const response = await fetch(`${protocol}://${host}/api/watch-later`, {
      headers: {
        cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Failed to fetch watch-later list:", response.status);
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching watch-later list:", error);
    return [];
  }
}

export function isInWatchLater(
  watchLaterList: { mediaId: number; mediaType: string }[],
  mediaId: number,
  mediaType: "movie" | "tv"
): boolean {
  return watchLaterList.some((item) => item.mediaId === mediaId && item.mediaType === mediaType);
}

export function createWatchLaterLookup(
  watchLaterList: { mediaId: number; mediaType: string }[]
): Set<string> {
  const s = new Set<string>();
  for (const item of watchLaterList) {
    s.add(buildKey(item.mediaId, item.mediaType as "movie" | "tv"));
  }
  return s;
}

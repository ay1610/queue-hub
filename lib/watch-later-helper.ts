import { headers } from "next/headers";
import { WatchLaterItem } from "./types/watch-later";

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
    console.log(data);
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

export function createWatchLaterLookup(watchLaterList: { mediaId: number; mediaType: string }[]) {
  return watchLaterList.reduce(
    (lookup, item) => {
      lookup[`${item.mediaId}-${item.mediaType}`] = true;
      return lookup;
    },
    {} as Record<string, boolean>
  );
}

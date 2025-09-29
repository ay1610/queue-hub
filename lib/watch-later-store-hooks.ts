"use client";

import { useEffect } from "react";
import { useWatchLaterStore } from "@/lib/stores/watchLaterStore";
import { buildKey } from "@/lib/watch-later-utils";
import type { WatchLaterMediaType } from "@/lib/types/watch-later";
import { useWatchLaterList } from "@/lib/watch-later-hooks";

export function useIsInWatchLater(mediaId: number, mediaType: WatchLaterMediaType): boolean {
  return useWatchLaterStore((s) => s.lookup.has(buildKey(mediaId, mediaType)));
}

export function useWatchLaterCount(): number {
  return useWatchLaterStore((s) => s.items.length);
}

export function useWatchLaterActions() {
  return useWatchLaterStore((s) => ({
    add: s.add,
    remove: s.remove,
    clear: s.clear,
  }));
}

// Hydrate the store from React Query source of truth
export function useHydrateWatchLaterStore() {
  const { data, isLoading, isError, error } = useWatchLaterList();
  const hydrate = useWatchLaterStore((s) => s.hydrateFromList);
  const setStatus = useWatchLaterStore((s) => s.setStatus);

  useEffect(() => {
    if (isLoading) {
      setStatus("loading");
      return;
    }
    if (isError) {
      setStatus("error", (error as Error | undefined)?.message);
      return;
    }
    if (data?.data) {
      hydrate(data.data);
    }
  }, [isLoading, isError, error, data, hydrate, setStatus]);
}

// Small component to mount in Providers to ensure global hydration
export function WatchLaterHydrator() {
  useHydrateWatchLaterStore();
  return null;
}

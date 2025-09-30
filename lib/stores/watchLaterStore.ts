"use client";

import { create } from "zustand";
import type { WatchLaterItem, WatchLaterMediaType } from "@/lib/types/watch-later";
import { buildKey, toLookup } from "@/lib/watch-later-utils";

export type WatchLaterStatus = "idle" | "loading" | "loaded" | "error";

export interface WatchLaterState {
  // Set of keys: `${mediaId}-${mediaType}`
  lookup: Set<string>;
  // Optional full list for counts or diagnostics
  items: WatchLaterItem[];
  status: WatchLaterStatus;
  error?: string;

  // Actions
  hydrateFromList: (list: WatchLaterItem[]) => void;
  add: (mediaId: number, mediaType: WatchLaterMediaType) => void;
  remove: (mediaId: number, mediaType: WatchLaterMediaType) => void;
  clear: () => void;
  setStatus: (status: WatchLaterStatus, error?: string) => void;
}

// moved to lib/watch-later-utils.ts

export const useWatchLaterStore = create<WatchLaterState>()((set) => ({
  lookup: new Set<string>(),
  items: [],
  status: "idle",
  error: undefined,

  hydrateFromList: (list) =>
    set(() => ({
      items: list,
      lookup: toLookup(list),
      status: "loaded",
      error: undefined,
    })),

  add: (mediaId, mediaType) =>
    set((state) => {
      const key = buildKey(mediaId, mediaType);
      if (state.lookup.has(key)) return state;
      const nextLookup = new Set(state.lookup);
      nextLookup.add(key);
      return {
        lookup: nextLookup,
        items: [...state.items, { mediaId, mediaType }],
      };
    }),

  remove: (mediaId, mediaType) =>
    set((state) => {
      const key = buildKey(mediaId, mediaType);
      if (!state.lookup.has(key)) return state;
      const nextLookup = new Set(state.lookup);
      nextLookup.delete(key);
      return {
        lookup: nextLookup,
        items: state.items.filter((it) => !(it.mediaId === mediaId && it.mediaType === mediaType)),
      };
    }),

  clear: () =>
    set(() => ({
      lookup: new Set(),
      items: [],
      status: "idle",
      error: undefined,
    })),

  setStatus: (status, error) => set(() => ({ status, error })),
}));

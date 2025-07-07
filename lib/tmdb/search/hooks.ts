"use client";

import { useQuery } from "@tanstack/react-query";
import { searchMedia } from "./client";
import type { DetailedMediaSearchResult } from "@/lib/types/tmdb";
import { DEFAULT_CACHE } from "@/lib/cache-config";

export function useMediaSearch(query: string, page = 1) {
  return useQuery<DetailedMediaSearchResult, Error>({
    queryKey: ["mediaSearch", query, page],
    queryFn: async () => {
      try {
        const result = await searchMedia(query, page);
        return result;
      } catch (error) {
        throw error;
      }
    },
    ...DEFAULT_CACHE,
    enabled: query.length > 1,
  });
}

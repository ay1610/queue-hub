"use client";

import { useQuery } from "@tanstack/react-query";
import { searchMedia } from "./client";
import type { DetailedMediaSearchResult } from "./types";

export function useMediaSearch(query: string, page = 1) {
  return useQuery<DetailedMediaSearchResult>({
    queryKey: ["mediaSearch", query, page],
    queryFn: async () => {
      try {
        const result = await searchMedia(query, page);
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: query.length > 1,
  });
}

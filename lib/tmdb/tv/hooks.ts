"use client";

// React hooks for TMDB TV API
import { useQuery } from "@tanstack/react-query";
import { getTrendingTVShows } from "./client";
import type { TrendingTVShowsResponse } from "@/lib/types/tmdb";
import { DEFAULT_CACHE } from "@/lib/cache-config";

export function useTrendingTVShows(page: number = 1) {
  return useQuery<TrendingTVShowsResponse, Error>({
    queryKey: ["trending-tv-shows", page],
    queryFn: () => getTrendingTVShows(page),
    ...DEFAULT_CACHE,
  });
}

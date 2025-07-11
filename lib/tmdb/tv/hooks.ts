"use client";

// React hooks for TMDB TV API
import { useQuery } from "@tanstack/react-query";
import { getTrendingTVShows, getTVGenres } from "./client";
import { getTVShowVideos } from "./videos";
import type { TMDBVideosResponse } from "./videos";
import type { TrendingTVShowsResponse } from "@/lib/types/tmdb";
import { DEFAULT_CACHE, VERY_LONG } from "@/lib/cache-config";

export function useTrendingTVShows(page: number = 1) {
  return useQuery<TrendingTVShowsResponse, Error>({
    queryKey: ["trending-tv-shows", page],
    queryFn: () => getTrendingTVShows(page),
    ...DEFAULT_CACHE,
  });
}

export function useTVGenres() {
  return useQuery({
    queryKey: ["tv-genres"],
    queryFn: getTVGenres,
    ...VERY_LONG,
  });
}

export function useTVShowVideos(tvId: number) {
  return useQuery<TMDBVideosResponse, Error>({
    queryKey: ["tvShowVideos", tvId],
    queryFn: () => getTVShowVideos(tvId),
    enabled: !!tvId,
    ...VERY_LONG,
  });
}

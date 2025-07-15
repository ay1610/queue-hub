"use client";

// React hooks for TMDB TV API
import { useQuery } from "@tanstack/react-query";
import { getTrendingTVShows, getTVGenres, getTVShowExternalIds, getTVShowVideos } from "./client";
import type { TMDBVideosResponse, TrendingTVShowsResponse } from "@/lib/types/tmdb";
import { DEFAULT_CACHE, TMDB_CACHE } from "@/lib/cache-config";

/**
 * Gets TV shows that are currently popular and trending.
 *
 * @param page - Page number to load (starts at 1)
 * @returns TV shows data with loading and error states
 */
export function useTrendingTVShows(page: number = 1) {
  return useQuery<TrendingTVShowsResponse, Error>({
    queryKey: ["trending-tv-shows", page],
    queryFn: () => getTrendingTVShows(page),
    ...DEFAULT_CACHE,
  });
}

/**
 * Gets the complete list of TV show categories.
 *
 * @returns All available TV genres (Drama, Comedy, etc.)
 */
export function useTVGenres() {
  return useQuery({
    queryKey: ["tv-genres"],
    queryFn: getTVGenres,
    ...TMDB_CACHE.VERY_LONG,
  });
}

/**
 * Gets trailers and promotional videos for a TV show.
 *
 * @param tvId - The TV show ID number
 * @returns Videos data including trailers, teasers, and behind-the-scenes content
 */
export function useTVShowVideos(tvId: number) {
  return useQuery<TMDBVideosResponse, Error>({
    queryKey: ["tvShowVideos", tvId],
    queryFn: () => getTVShowVideos(tvId),
    enabled: !!tvId,
    ...TMDB_CACHE.VERY_LONG,
  });
}

/**
 * Gets links to the TV show on other websites and platforms.
 *
 * @param tvId - The TV show ID number
 * @returns IDs for IMDb, TVDb, Twitter, and other external services
 */
export function useTVExternalIds(tvId: number) {
  return useQuery({
    queryKey: ["tv-external-ids", tvId],
    queryFn: () => getTVShowExternalIds(tvId),
    enabled: !!tvId,
    ...TMDB_CACHE.VERY_LONG,
  });
}

"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getTrendingMovies, getMovieGenres, getMovieDetails } from "./client";
import { getMovieVideos } from "./videos";
import { getMovieWatchProviders } from "./watchProviders";
import { getMovieExternalIds } from "./externalIds";
import type { TrendingMoviesResponse } from "@/lib/types/tmdb";
import { DEFAULT_CACHE, TMDB_CACHE, MEDIA_DETAILS_CACHE } from "@/lib/cache-config";

/**
 * Infinite query hook for trending movies (for infinite scroll UI)
 * Uses TanStack Query's useInfiniteQuery for paginated fetching.
 */
export function useInfiniteTrendingMovies() {
  return useInfiniteQuery<TrendingMoviesResponse, Error>({
    queryKey: ["trending-movies-infinite"],
    queryFn: async ({ pageParam = 1 }) => getTrendingMovies(Number(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // TMDB API: lastPage.total_pages, lastPage.page
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    ...DEFAULT_CACHE,
  });
}
// React hooks for TMDB Movie API

export function useTrendingMovies(page: number = 1) {
  return useQuery<TrendingMoviesResponse, Error>({
    queryKey: ["trending-movies", page],
    queryFn: () => getTrendingMovies(page),
    ...DEFAULT_CACHE,
  });
}

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
    ...MEDIA_DETAILS_CACHE,
  });
}

export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: ["movie-videos", movieId],
    queryFn: () => getMovieVideos(movieId),
    enabled: !!movieId,
    ...MEDIA_DETAILS_CACHE,
  });
}

export function useMovieGenres() {
  return useQuery({
    queryKey: ["movie-genres"],
    queryFn: getMovieGenres,
    ...TMDB_CACHE.VERY_LONG,
  });
}

export function useMovieWatchProviders(movieId: number) {
  return useQuery({
    queryKey: ["movie-watch-providers", movieId],
    queryFn: () => getMovieWatchProviders(movieId),
    enabled: !!movieId,
    ...MEDIA_DETAILS_CACHE,
  });
}

export function useMovieExternalIds(movieId: number) {
  return useQuery({
    queryKey: ["movie-external-ids", movieId],
    queryFn: () => getMovieExternalIds(movieId),
    enabled: !!movieId,
    ...TMDB_CACHE.VERY_LONG,
  });
}

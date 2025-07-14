"use client";

// React hooks for TMDB Movie API
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies, getMovieGenres } from "./client";
import type { TrendingMoviesResponse } from "@/lib/types/tmdb";
import { DEFAULT_CACHE, TMDB_CACHE } from "@/lib/cache-config";

export function useTrendingMovies(page: number = 1) {
  return useQuery<TrendingMoviesResponse, Error>({
    queryKey: ["trending-movies", page],
    queryFn: () => getTrendingMovies(page),
    ...DEFAULT_CACHE,
  });
}

import { getMovieDetails } from "./client";
import { getMovieVideos } from "./videos";
import { getMovieWatchProviders } from "./watchProviders";
import { MEDIA_DETAILS_CACHE } from "@/lib/cache-config"; // Use if available

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

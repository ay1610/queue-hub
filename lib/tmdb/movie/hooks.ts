"use client";

// React hooks for TMDB Movie API
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "./client";
import type { TrendingMoviesResponse } from "@/lib/types/tmdb";
import { DEFAULT_CACHE } from "@/lib/cache-config";

export function useTrendingMovies(page: number = 1) {
  return useQuery<TrendingMoviesResponse, Error>({
    queryKey: ["trending-movies", page],
    queryFn: () => getTrendingMovies(page),
    ...DEFAULT_CACHE,
  });
}

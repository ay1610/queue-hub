"use client";

// React hooks for TMDB Movie API
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "./client";
import type { TrendingMoviesResponse } from "./types";

export function useTrendingMovies(page: number = 1) {
  return useQuery<TrendingMoviesResponse, Error>({
    queryKey: ["trending-movies", page],
    queryFn: () => getTrendingMovies(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

import React from "react";
import { getProtectedUser } from "@/lib/auth-helpers";
import { getTrendingMovies } from "@/lib/tmdb/movie/client";
import { TrendingMoviesClientHydrated } from "@/components/trending-movies/TrendingMoviesClientHydrated";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { DEFAULT_CACHE } from "@/lib/cache-config";
import type { TrendingMoviesResponse } from "@/lib/types/tmdb";

/**
 * Server-side page for trending movies with React Query hydration.
 */
export default async function TrendingMoviesPage() {
  await getProtectedUser(); // Redirects to sign-in if not authenticated

  // Set up QueryClient and prefetch trending movies (first page)
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["trending-movies-infinite"],
    queryFn: async ({ pageParam = 1 }) => getTrendingMovies(Number(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage: TrendingMoviesResponse) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    ...DEFAULT_CACHE,
  });
  const dehydratedState = dehydrate(queryClient);

  return <TrendingMoviesClientHydrated dehydratedState={dehydratedState} />;
}

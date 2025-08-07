
import React from "react";
import { getProtectedUser } from "@/lib/auth-helpers";
import { getTrendingTVShows } from "@/lib/tmdb/tv/client";
import { TrendingTVShowsClientHydrated } from "@/components/trending-tvshows/TrendingTVShowsClientHydrated";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { DEFAULT_CACHE } from "@/lib/cache-config";
import type { TrendingTVShowsResponse } from "@/lib/types/tmdb";


/**
 * Server-side page for trending TV shows with React Query hydration.
 */
export default async function TrendingTVShowsServerPage() {
  await getProtectedUser(); // Redirects to sign-in if not authenticated

  // Set up QueryClient and prefetch trending TV shows (first page)
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["trending-tv-shows-infinite"],
    queryFn: async ({ pageParam = 1 }) => getTrendingTVShows(Number(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage: TrendingTVShowsResponse) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    ...DEFAULT_CACHE,
  });
  const dehydratedState = dehydrate(queryClient);

  return <TrendingTVShowsClientHydrated dehydratedState={dehydratedState} />;
}

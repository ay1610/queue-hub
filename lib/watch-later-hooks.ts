"use client";

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { createWatchLaterLookup } from "./watch-later-client-helpers";
import { WatchLaterResponse, WatchLaterMutationParams } from "./types/watch-later";
import { WATCH_LATER_CACHE } from "./cache-config";

// Query key factory for watch later functionality
export const watchLaterKeys = {
  all: ["watch-later"] as const,
  lists: () => [...watchLaterKeys.all, "list"] as const,
  list: () => [...watchLaterKeys.lists()] as const,
} as const;

// Reusable query options factory
export function watchLaterListQueryOptions<TData = WatchLaterResponse>(
  options?: Partial<UseQueryOptions<WatchLaterResponse, Error, TData>>
) {
  return {
    queryKey: watchLaterKeys.list(),
    queryFn: async (): Promise<WatchLaterResponse> => {
      const response = await fetch("/api/watch-later");
      if (!response.ok) {
        throw new Error("Failed to fetch watch later list");
      }
      return response.json();
    },
    ...WATCH_LATER_CACHE,
    ...options,
  } satisfies UseQueryOptions<WatchLaterResponse, Error, TData>;
}

// Hook to fetch watch later list
export function useWatchLaterList<TData = WatchLaterResponse>(
  options?: Partial<UseQueryOptions<WatchLaterResponse, Error, TData>>
) {
  return useQuery(watchLaterListQueryOptions(options));
}

// Hook to get watch later lookup object
export function useWatchLaterLookup() {
  const { data: watchLaterResponse } = useWatchLaterList();
  const watchLaterList = watchLaterResponse?.data || [];
  return createWatchLaterLookup(watchLaterList);
}

// Hook to add/remove items from watch later
export function useWatchLaterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mediaId, mediaType, action }: WatchLaterMutationParams) => {
      const method = action === "add" ? "POST" : "DELETE";
      const response = await fetch("/api/watch-later", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, mediaType }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} item ${action === "add" ? "to" : "from"} watch later`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch watch later list using the new query key factory
      queryClient.invalidateQueries({ queryKey: watchLaterKeys.lists() });
    },
  });
}

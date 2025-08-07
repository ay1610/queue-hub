"use client";

import { useQueryClient } from "@tanstack/react-query";
import { mediaDetailsKeys } from "@/lib/media-details-hooks";
import { getMovieDetails } from "@/lib/tmdb/movie/client";
import { getTVShowDetails } from "@/lib/tmdb/tv/client";
import { WatchLaterMediaType } from "@/lib/types/watch-later";
import { useMemo, useCallback, useEffect, useRef } from "react";

interface PrefetchMediaDetailsOnHoverProps {
  mediaId: number;
  mediaType: WatchLaterMediaType;
  children: React.ReactNode;
  prefetchDelay?: number; // debounce delay in ms (default 200)
}

/**
 * Wrap any element to prefetch media details on mouse enter (hover).
 * Usage: <PrefetchMediaDetailsOnHover mediaId={id} mediaType={type}><Card ... /></PrefetchMediaDetailsOnHover>
 */
export function PrefetchMediaDetailsOnHover({
  mediaId,
  mediaType,
  children,
  prefetchDelay = 200,
}: PrefetchMediaDetailsOnHoverProps) {
  const queryClient = useQueryClient();

  // Debounce implementation (no lodash, React-safe)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounce = useCallback((fn: () => void, delay: number) => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(fn, delay);
    };
  }, []);

  const handlePrefetch = useCallback(() => {
    if (!mediaId || !mediaType) return;
    queryClient.prefetchQuery({
      queryKey: mediaDetailsKeys.detail(mediaId, mediaType),
      queryFn: async () => {
        try {
          if (mediaType === "movie") {
            const movieDetails = await getMovieDetails(mediaId, "watch/providers");
            console.log("[Prefetch] movie details fetched", { mediaId, movieDetails });
            return { ...movieDetails, type: "movie" };
          } else {
            const tvDetails = await getTVShowDetails(mediaId, "watch/providers");
            console.log("[Prefetch] tv details fetched", { mediaId, tvDetails });
            return { ...tvDetails, type: "tv" };
          }
        } catch (e) {
          console.error("[Prefetch] error fetching media details", {
            mediaId,
            mediaType,
            error: e,
          });
          throw e;
        }
      },
    });
  }, [mediaId, mediaType, queryClient]);

  // Debounced handler (default 200ms, configurable)
  const debouncedPrefetch = useMemo(
    () => debounce(handlePrefetch, prefetchDelay),
    [debounce, handlePrefetch, prefetchDelay]
  );

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div onMouseEnter={debouncedPrefetch} onTouchStart={debouncedPrefetch}>
      {children}
    </div>
  );
}

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useMediaSearch } from "@/lib/tmdb/search/hooks";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";
import { MediaCard } from "@/components/media-card/MediaCard";
import { SearchResultSkeleton } from "@/components/search/SearchResultSkeleton";
import { cn } from "@/lib/utils";

/**
 * SearchPage component for displaying search results.
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const { data, error, isLoading } = useMediaSearch(query);
  const watchLaterLookup = useWatchLaterLookup();
  // Use results length for totalResults, fallback to 0
  const totalResults = Array.isArray(data?.results) ? data.results.length : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Search Results for &ldquo;{query}&rdquo;</h1>
        </div>
        <SearchResultSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">Unable to fetch search results. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Search Results for &ldquo;{query}&rdquo;</h1>
        <p className="text-sm text-muted-foreground">Found {totalResults} results</p>
      </div>

      {data?.results?.length ? (
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 justify-center")}>
          {data?.results.map((item) => {
            // Only allow "movie" or "tv" as type TODO: Add persons to the Media card
            const mediaType =
              item.media_type === "movie" || item.media_type === "tv" ? item.media_type : undefined;
            if (!mediaType) return null;
            const isItemInWatchLater = watchLaterLookup[`${item.id}-${mediaType}`] || false;
            return (
              <MediaCard
                key={item.id}
                media={item}
                type={mediaType}
                isInWatchLater={isItemInWatchLater}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          {query.length > 0 ? (
            <>
              <p className="text-muted-foreground text-lg">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Try searching with different keywords
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-lg">Start searching to see results.</p>
          )}
        </div>
      )}
    </div>
  );
}

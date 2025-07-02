"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useMediaSearch } from "@/lib/tmdb/search/hooks";
import { MediaCard } from "@/components/media-card/MediaCard";
import { cn } from "@/lib/utils";

/**
 * SearchPage component for displaying search results.
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const { data, error, isLoading } = useMediaSearch(query);

  const filteredData = data?.results?.filter((item) => item.media_type !== "person") || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: Unable to fetch search results.</div>;
  }

  return (
    <div>
      <h1>Search Results for {query}</h1>

      {data?.results?.length ? (
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 justify-center")}>
          {data?.results.map((item) => {
            // Only allow "movie" or "tv" as type
            const mediaType =
              item.media_type === "movie" || item.media_type === "tv" ? item.media_type : undefined;
            if (!mediaType) return null;
            return <MediaCard key={item.id} media={item} type={mediaType}></MediaCard>;
          })}
        </div>
      ) : (
        <div>No results found.</div>
      )}
    </div>
  );
}

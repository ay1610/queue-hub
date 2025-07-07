"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { JSX } from "react";
import { cn } from "@/lib/utils";
import { useTrendingTVShows } from "@/lib/tmdb/tv/hooks";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";
import { TVShowHero } from "./TVShowHero";
import { TVShowSkeleton } from "./TVShowSkeleton";
import { MediaCard } from "@/components/media-card/MediaCard";
import type { TMDBTVShow } from "@/lib/types/tmdb";

/**
 * Client-side component that fetches trending TV shows and watch later list using React Query,
 * then displays a hero section for a random show followed by a grid of trending TV show cards.
 */
export function TrendingTVShowsClient(): JSX.Element {
  const [heroShow, setHeroShow] = useState<TMDBTVShow | null>(null);
  const { data: trendingData, isLoading, error } = useTrendingTVShows(1);
  const watchLaterLookup = useWatchLaterLookup();

  const shows = useMemo(() => trendingData?.results || [], [trendingData?.results]);

  // Set hero show when data is available
  useEffect(() => {
    if (shows.length > 0 && !heroShow) {
      const randomIndex = Math.floor(Math.random() * shows.length);
      setHeroShow(shows[randomIndex]);
    }
  }, [shows, heroShow]);

  if (isLoading) {
    return <TVShowSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-500">Failed to load trending TV shows</div>
      </div>
    );
  }

  if (!shows.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">No trending TV shows found</div>
      </div>
    );
  }

  return (
    <>
      {heroShow && <TVShowHero show={heroShow} />}
      <section className={cn("w-[85vw] mt-8 mx-auto")} aria-label="Trending TV Shows Section">
        <h2 className={cn("text-2xl font-bold mb-4 text-center")}>Trending TV Shows</h2>
        <div
          className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 justify-center")}
          aria-label="Trending TV Shows Grid"
        >
          {shows.map((show) => {
            const isInWatchLater = watchLaterLookup[`${show.id}-tv`] || false;
            return (
              <MediaCard key={show.id} media={show} type="tv" isInWatchLater={isInWatchLater} />
            );
          })}
        </div>
      </section>
    </>
  );
}

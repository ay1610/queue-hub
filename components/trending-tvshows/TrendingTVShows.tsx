import React from "react";
import type { JSX } from "react";
import { cn } from "@/lib/utils";
import { getTrendingTVShows } from "@/lib/tmdb/tv/client";
import { TVShowHero } from "./TVShowHero";
import { TrendingTVShowCard } from "./TrendingTVShowCard";

/**
 * Fetches trending TV shows and displays a hero section for a random show,
 * followed by a grid of trending TV show cards.
 *
 * @returns A React fragment with a hero and trending TV shows grid, or null if no data.
 */
export async function TrendingTVShows(): Promise<JSX.Element | null> {
  const data = await getTrendingTVShows(1);
  if (!data || !data.results.length) return null;

  // Pick a random show for the hero
  const randomIndex = Math.floor(Math.random() * data.results.length);
  const heroShow = data.results[randomIndex];

  return (
    <>
      <TVShowHero show={heroShow} />
      <section className={cn("w-[85vw] mt-8 mx-auto")} aria-label="Trending TV Shows Section">
        <h2 className={cn("text-2xl font-bold mb-4 text-center")}>Trending TV Shows</h2>
        <div
          className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 justify-center")}
          aria-label="Trending TV Shows Grid"
        >
          {data.results.map((show) => (
            <TrendingTVShowCard key={show.id} show={show} />
          ))}
        </div>
      </section>
    </>
  );
}

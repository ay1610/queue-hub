import React from "react";
import { GridBg } from "@/components/GridBg";

/**
 * Layout for Trending pages (movies and TV shows) using segment params.
 * Provides a consistent wrapper and heading for trending content.
 * Dynamically displays 'Trending Movies' or 'Trending Shows' based on the route segment.
 */
export default function TrendingTypeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { type: string };
}) {
  const heading =
    params.type === "movies"
      ? "Trending Movies"
      : params.type === "tv"
        ? "Trending Shows"
        : "Trending";
  return (
    <div className="relative min-h-screen">
      <GridBg />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">{heading}</h1>
        {children}
      </div>
    </div>
  );
}

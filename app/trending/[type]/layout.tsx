
import React from "react";
import { GridBg } from "@/components/GridBg";

/**
 * Layout for Trending pages (movies and TV shows) using segment params.
 * Provides a consistent wrapper and heading for trending content.
 * Dynamically displays 'Trending Movies' or 'Trending Shows' based on the route segment.
 */
export default async function TrendingTypeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { type: string } | Promise<{ type: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const heading =
    resolvedParams.type === "movies"
      ? "Trending Movies"
      : resolvedParams.type === "tv"
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

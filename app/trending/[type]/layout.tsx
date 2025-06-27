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
    <main className="relative max-w-5xl xl:max-w-4xl 2xl:max-w-3xl mx-auto px-0 py-8 min-h-screen">
      <GridBg />
      <h1 className="text-4xl font-bold mb-8 relative z-10 mx-8 sm:mx-12 md:mx-20 lg:mx-32">
        {heading}
      </h1>
      <div className="relative z-10 mx-8 sm:mx-12 md:mx-20 lg:mx-32">{children}</div>
    </main>
  );
}

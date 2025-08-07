"use client";

import React from "react";
import { TrendingMoviesClient } from "./TrendingMoviesClient";
import { HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";

interface TrendingMoviesClientHydratedProps {
  dehydratedState: DehydratedState;
}

/**
 * Client component that receives dehydrated React Query state from the server and hydrates it.
 */
export const TrendingMoviesClientHydrated = ({
  dehydratedState,
}: TrendingMoviesClientHydratedProps) => {
  return (
    <HydrationBoundary state={dehydratedState}>
      <TrendingMoviesClient />
    </HydrationBoundary>
  );
};
export default TrendingMoviesClientHydrated;

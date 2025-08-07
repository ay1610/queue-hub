"use client";

import React from "react";
import { TrendingTVShowsClient } from "./TrendingTVShowsClient";

import { HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";

interface TrendingTVShowsClientHydratedProps {
  dehydratedState: DehydratedState;
}

/**
 * Client component that receives dehydrated React Query state from the server and hydrates it.
 */
export const TrendingTVShowsClientHydrated = ({
  dehydratedState,
}: TrendingTVShowsClientHydratedProps) => {
  return (
    <HydrationBoundary state={dehydratedState}>
      <TrendingTVShowsClient />
    </HydrationBoundary>
  );
};
export default TrendingTVShowsClientHydrated;

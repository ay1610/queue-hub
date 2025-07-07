import React from "react";
import { TrendingTVShowsClient } from "@/components/trending-tvshows/TrendingTVShowsClient";
import { getProtectedUser } from "@/lib/auth-helpers";

/**
 * Page for displaying trending TV shows using the shared trending layout.
 */
export default async function TrendingTVShowsPage() {
  await getProtectedUser(); // Redirects to sign-in if not authenticated
  return <TrendingTVShowsClient />;
}

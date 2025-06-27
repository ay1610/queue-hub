import React from "react";
import { TrendingTVShows } from "@/components/trending-tvshows/TrendingTVShows";
import { getProtectedUser } from "@/lib/auth-helpers";

/**
 * Page for displaying trending TV shows using the shared trending layout.
 */
export default async function TrendingTVShowsPage() {
  await getProtectedUser(); // Redirects to sign-in if not authenticated
  return <TrendingTVShows />;
}

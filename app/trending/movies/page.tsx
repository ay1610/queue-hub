import React from "react";
import { TrendingMoviesClient } from "@/components/trending-movies/TrendingMoviesClient";
import { getProtectedUser } from "@/lib/auth-helpers";

/**
 * Page for displaying trending movies using the shared trending layout.
 */
export default async function TrendingMoviesPage() {
  await getProtectedUser(); // Redirects to sign-in if not authenticated
  return <TrendingMoviesClient />;
}

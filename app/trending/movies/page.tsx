import React from "react";
import { TrendingMovies } from "@/components/trending-movies/TrendingMovies";
import { getProtectedUser } from "@/lib/auth-helpers";

/**
 * Page for displaying trending movies using the shared trending layout.
 */
export default async function TrendingMoviesPage() {
  await getProtectedUser(); // Redirects to sign-in if not authenticated
  return <TrendingMovies />;
}

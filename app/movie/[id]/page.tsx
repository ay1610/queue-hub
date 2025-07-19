"use client";

import { MediaDetailPage } from "@/components/MediaDetailPage";
import { useRuntimeData } from "@/lib/hooks/useRuntimeData";
import { useMediaDetails } from "@/lib/media-details-hooks";
import {
  useMovieVideos,
  useMovieWatchProviders,
  useMovieExternalIds,
} from "@/lib/tmdb/movie/hooks";
import type { TMDBVideo } from "@/lib/types/tmdb/videos";
import type { WatchProvidersResponse } from "@/lib/tmdb/movie/watchProviders";
import { use } from "react";
import { getFormattedRuntime } from "@/lib/media-utils";

/**
 * MovieDetailPageWrapper - Displays detailed information for a movie, including genres, trailer, and watch providers.
 *
 * @param props - Object containing params, a Promise resolving to route parameters (expects movie id).
 * @returns MediaDetailPage with movie details, or loading/error/fallback UI.
 */
export default function MovieDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movieId = Number(id);

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useMediaDetails(movieId, "movie");
  const {
    data: videosResp,
    isLoading: videosLoading,
    error: videosError,
  } = useMovieVideos(movieId);
  const {
    data: watchProvidersResp,
    isLoading: providersLoading,
    error: providersError,
  } = useMovieWatchProviders(movieId);
  const {
    data: externalIds,
    isLoading: externalIdsLoading,
    error: externalIdsError,
  } = useMovieExternalIds(movieId);

  const imdbId = externalIds?.imdb_id || null;
  const {
    data: runtimeData,
    isLoading: runtimeLoading,
    error: runtimeError,
  } = useRuntimeData(imdbId);

  const runtimeMins = runtimeData?.data?.runtime_minutes || null;
  const formattedRuntime = getFormattedRuntime(runtimeMins);
  // Loading state
  if (
    movieLoading ||
    videosLoading ||
    providersLoading ||
    externalIdsLoading ||
    runtimeLoading ||
    runtimeLoading
  ) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  // Error state: combine all errors
  if (movieError || videosError || providersError || externalIdsError || runtimeError) {
    return (
      <div className="text-red-500 text-center py-8">
        Error:{" "}
        {movieError?.message ||
          videosError?.message ||
          providersError?.message ||
          externalIdsError?.message ||
          "Unknown error"}
      </div>
    );
  }

  // Defensive: If movie details are missing, show fallback
  if (!movie) {
    return <div className="text-gray-500 text-center py-8">Movie details not found.</div>;
  }

  // Defensive: Type-check videos response before accessing
  const trailer: TMDBVideo | undefined = Array.isArray(videosResp?.results)
    ? videosResp.results.find((v) => v.site === "YouTube" && v.type === "Trailer")
    : undefined;

  // Defensive: Type-check providers response before accessing
  const usProviders: WatchProvidersResponse["results"]["US"] | undefined =
    watchProvidersResp?.results?.US ?? undefined;

  // Log external IDs for testing (temporary)
  if (externalIds) {
    console.log("External IDs:");
    console.log("IMDB ID:", externalIds.imdb_id);
  }

  // Render main detail page
  return (
    <MediaDetailPage
      id={movieId}
      title={movie.title ?? "Untitled"}
      type="movie"
      tagline={movie.tagline ?? ""}
      overview={movie.overview ?? ""}
      backdropPath={movie.backdrop_path ?? ""}
      posterPath={movie.poster_path ?? ""}
      genres={Array.isArray(movie.genres) ? movie.genres : []}
      voteAverage={typeof movie.vote_average === "number" ? movie.vote_average : 0}
      trailer={trailer}
      usProviders={usProviders}
      runtimeMins={formattedRuntime}
    />
  );
}

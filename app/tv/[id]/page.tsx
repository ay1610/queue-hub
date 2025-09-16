"use client";

import { MediaDetailPage } from "@/components/MediaDetailPage";
import { useMediaDetails } from "@/lib/media-details-hooks";
import { getFilteredGenres, getFormattedRuntime, getUSProviders } from "@/lib/media-utils";
import { use } from "react";
import { useTVExternalIds, useTVGenres } from "@/lib/tmdb/tv/hooks";
import { useTVShowVideos } from "@/lib/tmdb/tv/hooks";
import { WatchProvidersResponse } from "@/lib/tmdb/movie/watchProviders";
import { useRuntimeData } from "@/lib/hooks/useRuntimeData";
import { useIMDBRating } from "@/lib/hooks/useIMDBRating";

/**
 * TVDetailPage - Displays detailed information for a TV show, including genres, trailer, and watch providers.
 *
 * @param params - Promise resolving to route parameters, expected to contain TV show id.
 * @returns MediaDetailPage with TV show details, or loading/error/fallback UI.
 */
export default function TVDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tvId = Number(id);

  const { data: tvGenres, isLoading: genresLoading, error: genresError } = useTVGenres();
  const {
    data: details,
    isLoading: detailsLoading,
    error: detailsError,
  } = useMediaDetails(tvId, "tv");

  const {
    data: tvVideosResp,
    isLoading: videosLoading,
    error: videosError,
  } = useTVShowVideos(tvId);

  const {
    data: tvExternalIds,
    isLoading: externalIdsLoading,
    error: externalIdsError,
  } = useTVExternalIds(tvId);

  const imdbId = tvExternalIds?.imdb_id;
  const {
    data: runtimeData,
    isLoading: runtimeLoading,
    error: runtimeError,
  } = useRuntimeData(imdbId, { enabled: !!imdbId });

  const {
    data: imdbRating,
    isLoading: imdbRatingLoading,
    error: imdbRatingError,
  } = useIMDBRating(imdbId, { enabled: !!imdbId });

  const imdbRatingNumber = imdbRating?.data?.average_rating ?? undefined;
  const imdbVotes = imdbRating?.data?.num_votes ?? undefined;

  const runtimeMins = runtimeData?.data?.runtime_minutes || null;
  const formattedRuntime = getFormattedRuntime(runtimeMins);
  if (
    !tvId ||
    detailsLoading ||
    genresLoading ||
    videosLoading ||
    externalIdsLoading ||
    imdbRatingLoading ||
    runtimeLoading
  ) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (detailsError || genresError || videosError || externalIdsError || runtimeError) {
    return (
      <div className="text-red-500 text-center py-8">
        Error:{" "}
        {detailsError?.message ||
          genresError?.message ||
          videosError?.message ||
          externalIdsError?.message ||
          imdbRatingError?.message ||
          runtimeError?.message}
      </div>
    );
  }

  if (!details) {
    return <div className="text-gray-500 text-center py-8">Media details not found.</div>;
  }

  const title: string = details.type === "tv" ? details.name : details.title;
  const watchProvidersRaw = details["watch/providers"];
  const watchProviders: WatchProvidersResponse | undefined = watchProvidersRaw
    ? { id: tvId, ...watchProvidersRaw }
    : undefined;
  const usProvidersRaw = getUSProviders(watchProviders);
  const usProviders = usProvidersRaw
    ? { ...usProvidersRaw, link: usProvidersRaw.link ?? "" }
    : { link: "" };

  const trailer = Array.isArray(tvVideosResp?.results)
    ? tvVideosResp.results.find((v) => v.type === "Trailer" && v.site === "YouTube")
    : undefined;

  const filteredGenres = getFilteredGenres(details.genres, tvGenres);

  return (
    <MediaDetailPage
      id={tvId}
      type="tv"
      title={title}
      overview={details.overview}
      backdropPath={details.backdrop_path}
      posterPath={details.poster_path || ""}
      genres={filteredGenres}
      trailer={trailer}
      usProviders={usProviders}
      runtimeMins={formattedRuntime}
      imdbRating={imdbRatingNumber}
      imdbVotes={imdbVotes}
    />
  );
}

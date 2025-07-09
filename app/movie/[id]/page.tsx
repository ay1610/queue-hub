import { getMovieDetails } from "@/lib/tmdb/movie/client";
import { getMovieVideos } from "@/lib/tmdb/movie/videos";
import { getMovieWatchProviders } from "@/lib/tmdb/movie/watchProviders";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MediaDetailPage } from "@/components/MediaDetailPage";
import type { TMDBVideo } from "@/lib/tmdb/movie/videos";
import type { WatchProvidersResponse } from "@/lib/tmdb/movie/watchProviders";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const movie = await getMovieDetails(Number(params.id));
  return {
    title: movie?.title || "Movie Details",
    description: movie?.overview || "Movie details page",
  };
}

export default async function MovieDetailPageWrapper(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const movie = await getMovieDetails(Number(params.id));
  if (!movie) return notFound();

  // Fetch videos (trailers, teasers, etc.)
  const videos = await getMovieVideos(Number(params.id));
  const trailer: TMDBVideo | undefined = videos.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  // Fetch where to watch providers (for US by default)
  const watchProviders: WatchProvidersResponse = await getMovieWatchProviders(Number(params.id));
  const usProviders = watchProviders?.results?.US;

  return <MediaDetailPage media={movie} trailer={trailer} usProviders={usProviders} />;
}

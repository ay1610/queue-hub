import { getTVShowDetails } from "@/lib/tmdb/tv/client";
import { getTVShowVideos } from "@/lib/tmdb/tv/videos";
import { getTVShowWatchProviders } from "@/lib/tmdb/tv/watchProviders";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MediaDetailPage } from "@/components/MediaDetailPage";
import type { TMDBVideo } from "@/lib/tmdb/tv/videos";
import type { WatchProvidersResponse } from "@/lib/tmdb/tv/watchProviders";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const tv = await getTVShowDetails(Number(params.id));
  return {
    title: tv?.name || "TV Show Details",
    description: tv?.overview || "TV show details page",
  };
}

export default async function TVDetailPageWrapper(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const tv = await getTVShowDetails(Number(params.id));
  if (!tv) return notFound();

  // Fetch videos (trailers, teasers, etc.)
  const videos = await getTVShowVideos(Number(params.id));
  const trailer: TMDBVideo | undefined = videos.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  // Fetch where to watch providers (for US by default)
  const watchProviders: WatchProvidersResponse = await getTVShowWatchProviders(Number(params.id));
  const usProviders = watchProviders?.results?.US;

  return <MediaDetailPage media={tv} trailer={trailer} usProviders={usProviders} />;
}

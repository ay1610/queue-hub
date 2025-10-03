import { getTrendingTVShows } from "@/lib/tmdb/tv/client";
import { TrendingTVShowsCarousel } from "@/components/trending-tvshows/TrendingTVShowsCarousel";
import { fetchEnrichedTVShowData } from "@/lib/server/tvShowDataFetcher";
import type { EnrichedTVShowData } from "@/lib/types/tmdb";
import Link from "next/link";

export default async function TrendingTVShowsSection() {
    const tvData = await getTrendingTVShows(1);
    const topTVShows = tvData?.results?.slice(0, 20) ?? [];
    const { tvShows, tvShowDataMap } = await fetchEnrichedTVShowData(topTVShows);
    const enrichedTVShows: EnrichedTVShowData[] = tvShows.map(tvShow => {
        const aggregatedData = tvShowDataMap.get(tvShow.id);
        return {
            ...tvShow,
            ...aggregatedData,
        };
    });
    return (
        <section className="mt-12" aria-label="Trending TV Shows">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Trending TV Shows</h2>
                <Link
                    href="/trending/tv-server"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                    See All
                </Link>
            </div>
            <TrendingTVShowsCarousel tvShows={enrichedTVShows} />
        </section>
    );
}
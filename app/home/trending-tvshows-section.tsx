import { getTrendingTVShows } from "@/lib/tmdb/tv/client";
import { TrendingTVShowsCarousel } from "@/components/trending-tvshows/TrendingTVShowsCarousel";

export default async function TrendingTVShowsSection() {
    const tvData = await getTrendingTVShows(1);

    // Limit to top 12 items for performance
    const topTVShows = tvData?.results?.slice(0, 12) ?? [];

    return (
        <section className="mt-12" aria-label="Trending TV Shows">
            <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
            <TrendingTVShowsCarousel tvShows={topTVShows} />
        </section>
    );
}
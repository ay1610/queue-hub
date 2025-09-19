import { getTrendingMovies } from "@/lib/tmdb/movie/client";
import { TrendingMoviesCarousel } from "@/components/trending-movies/TrendingMoviesCarousel";

export default async function TrendingMoviesSection() {
    const moviesData = await getTrendingMovies(1);

    // Limit to top 12 items for performance
    const topMovies = moviesData?.results?.slice(0, 12) ?? [];

    return (
        <section className="mt-8" aria-label="Trending Movies">
            <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
            <TrendingMoviesCarousel movies={topMovies} />
        </section>
    );
}
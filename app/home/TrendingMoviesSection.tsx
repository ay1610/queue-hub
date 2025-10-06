import { getTrendingMovies } from "@/lib/tmdb/movie/client";
import { TrendingMoviesCarousel } from "@/components/trending-movies/TrendingMoviesCarousel";
import { fetchEnrichedMovieData } from "@/lib/server/movieDataFetcher";
import type { EnrichedMovieData } from "@/lib/types/tmdb";
import Link from "next/link";

export default async function TrendingMoviesSection() {
    const moviesData = await getTrendingMovies(1);
    const topMovies = moviesData?.results?.slice(0, 20) ?? [];
    const { movies, movieDataMap } = await fetchEnrichedMovieData(topMovies);
    const enrichedMovies: EnrichedMovieData[] = movies.map(movie => {
        const aggregatedData = movieDataMap.get(movie.id);
        return {
            ...movie,
            ...aggregatedData,
        };
    });
    return (
        <section className="mt-8" aria-label="Trending Movies">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Trending Movies</h2>
                <Link
                    href="/trending/movies"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                    See All
                </Link>
            </div>
            <TrendingMoviesCarousel movies={enrichedMovies} />
        </section>
    );
}
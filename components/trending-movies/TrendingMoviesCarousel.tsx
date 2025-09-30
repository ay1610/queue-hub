"use client";
import { Carousel } from "@/components/ui/Carousel";
import { InteractiveWatchLaterCard } from "@/components/media-card/WatchLaterAwareCard";
import type { EnrichedMovieData } from "@/lib/types/tmdb";

interface TrendingMoviesCarouselProps {
    movies: EnrichedMovieData[];
}

export function TrendingMoviesCarousel({ movies }: TrendingMoviesCarouselProps) {
    return (
        <Carousel
            className="min-h-[660px] sm:min-h-[700px]"
            items={movies}
            renderItem={(movie) => (
                <InteractiveWatchLaterCard
                    key={movie.id}
                    media={{
                        id: movie.id,
                        poster_path: movie.poster_path,
                        title: movie.title,
                        release_date: movie.release_date,
                        vote_average: movie.vote_average,
                        genre_ids: movie.genre_ids,
                    }}
                    type="movie"
                    runtime={movie.imdbRuntime}
                    rating={movie.imdbRating}
                />
            )}
            slidesPerView={5}
            autoplay={true}
            pauseOnHover={true}
        />
    );
}

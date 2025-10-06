"use client";
import { Carousel } from "@/components/ui/Carousel";
import { InteractiveWatchLaterCard } from "@/components/media-card/WatchLaterAwareCard";
import type { EnrichedTVShowData } from "@/lib/types/tmdb";

interface TrendingTVShowsCarouselProps {
    tvShows: EnrichedTVShowData[];
}

export function TrendingTVShowsCarousel({ tvShows }: TrendingTVShowsCarouselProps) {
    return (
        <Carousel
            className="min-h-[660px] sm:min-h-[700px]"
            items={tvShows}
            renderItem={(tvShow) => (
                <InteractiveWatchLaterCard
                    key={tvShow.id}
                    media={{
                        id: tvShow.id,
                        poster_path: tvShow.poster_path,
                        name: tvShow.name,
                        first_air_date: tvShow.first_air_date,
                        vote_average: tvShow.vote_average,
                        genre_ids: tvShow.genre_ids,
                    }}
                    type="tv"
                    runtime={tvShow.imdbRuntime}
                    rating={tvShow.imdbRating}
                />
            )}
            slidesPerView={5}
            autoplay={true}
            pauseOnHover={true}
        />
    );
}

"use client";
import { Carousel } from "@/components/ui/Carousel";
import { CarouselMediaCard } from "@/components/ui/CarouselMediaCard";
import Link from "next/link";
import type { TMDBTVShow } from "@/lib/types/tmdb";

interface TrendingTVShowsCarouselProps {
    tvShows: TMDBTVShow[];
}

export function TrendingTVShowsCarousel({ tvShows }: TrendingTVShowsCarouselProps) {
    return (
        <Carousel
            items={tvShows}
            renderItem={(tv) => (
                <Link key={tv.id} href={`/tv/${tv.id}`}>
                    <CarouselMediaCard
                        imageUrl={tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : "/fallback.jpg"}
                        title={tv.name || "Untitled"}
                    />
                </Link>
            )}
            slidesPerView={5}
            autoplay={true}
            pauseOnHover={true}
        />
    );
}

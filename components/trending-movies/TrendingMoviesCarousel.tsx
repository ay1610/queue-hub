"use client";
import { Carousel } from "@/components/ui/Carousel";
import { CarouselMediaCard } from "@/components/ui/CarouselMediaCard";
import Link from "next/link";
import type { TMDBMovie } from "@/lib/types/tmdb";

interface TrendingMoviesCarouselProps {
    movies: TMDBMovie[];
}

export function TrendingMoviesCarousel({ movies }: TrendingMoviesCarouselProps) {
    return (
        <Carousel
            items={movies}
            renderItem={(movie) => (
                <Link key={movie.id} href={`/movie/${movie.id}`}>
                    <CarouselMediaCard
                        imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/fallback.jpg"}
                        title={movie.title || "Untitled"}
                    />
                </Link>
            )}
            slidesPerView={5}
            autoplay={true}
            pauseOnHover={true}
        />
    );
}

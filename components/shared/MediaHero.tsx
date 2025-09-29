import React from "react";
import { MediaBackdrop } from "@/components/MediaBackdrop";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type MediaHeroProps = {
  title: string;
  overview: string;
  backdropPath: string;
  detailsLink: string;
};

/**
 * MediaHero is a shared component for displaying a hero section for movies or TV shows.
 * @param title - The title of the media.
 * @param overview - The overview or description of the media.
 * @param backdropPath - The backdrop image path for the media.
 * @param detailsLink - The link to the details page for the media.
 */
export function MediaHero({ title, overview, backdropPath, detailsLink }: MediaHeroProps) {
  const backdropUrl = backdropPath ? `https://image.tmdb.org/t/p/w1280${backdropPath}` : null;

  return (
    <section
      className="relative w-[85vw] min-h-[48vh] h-[48vw] max-h-[567px] flex items-end overflow-hidden bg-black px-8 md:px-16 lg:px-24 py-8 md:py-16 lg:py-24 mx-auto"
      aria-label={`Hero section for ${title}`}
    >
      {backdropUrl && (
        <MediaBackdrop src={backdropUrl} alt={`Backdrop for ${title}`} heightClass="h-full" />
      )}
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      <div className="relative z-20 max-w-4xl w-full flex flex-col items-center justify-center text-center mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white drop-shadow-xl">
          {title}
        </h2>
        <p className="text-white text-lg md:text-xl mb-6 max-w-2xl line-clamp-5 drop-shadow-md">
          {overview}
        </p>
        <Link href={detailsLink}>
          <Button variant="secondary" size="sm" className="mt-2 gap-2">
            <span>Details</span>
          </Button>
      </Link>
      </div>
    </section>
  );
}

import React from "react";
import { MediaCardShadcn } from "../media-card/MediaCardShadcn";
import { MediaCard } from "../media-card/MediaCard";
import { MediaDetails } from "@/lib/tmdb/types";
import { TMDBMovie, TMDBTVShow } from "@/lib/types/tmdb";
import { useWatchLaterLookup } from "@/lib/watch-later-hooks";
function isMovie(media: MediaDetails): media is TMDBMovie {
  return "title" in media;
}

function isTVShow(media: MediaDetails): media is TMDBTVShow {
  return "name" in media;
}

export interface RecommendationsListProps {
  isLoading: boolean;
  error: unknown;
  recommendations: Array<{
    id: string | number;
    mediaId: number;
    mediaType: string;
    fromUserId?: string;
    fromUsername?: string | null;
    message?: string | null;
    fromUserImage?: string | null;
  }>;
  details: Array<{ data?: MediaDetails } | undefined>;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  isLoading,
  error,
  recommendations,
  details,
}) => {
  const watchLaterLookup = useWatchLaterLookup();
  if (isLoading) {
    // Show 8 skeleton cards for loading state
    return (
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 justify-center mb-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="animate-pulse max-w-[340px] w-full">
            <div className="rounded-lg bg-gray-200 dark:bg-zinc-800 h-[525px] w-full mb-2" />
            <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded mb-1 w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }
  if (error) return <p>Error loading recommendations</p>;
  if (!recommendations || recommendations.length === 0) return <p>No recommendations received.</p>;
  return (
    <>
      <p>Found {recommendations.length} recommendations</p>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 justify-center mb-6">
        {details.map((detailsObj, index) => {
          const rec = recommendations[index];
          if (!detailsObj?.data || !rec) return null;
          const cardType = isMovie(detailsObj.data)
            ? "movie"
            : isTVShow(detailsObj.data)
              ? "tv"
              : null;
          if (!cardType) return null;
          const isInWatchLater = watchLaterLookup[`${rec.mediaId}-${cardType}`] || false;
          // Normalize poster_path to string|null
          const normalizedMedia = {
            ...detailsObj.data,
            poster_path:
              detailsObj.data.poster_path === undefined ? null : detailsObj.data.poster_path,
            vote_average:
              detailsObj.data.vote_average === undefined ? 0 : detailsObj.data.vote_average,
          };
          return (
            <div key={rec.id}>
              <MediaCardShadcn
                media={normalizedMedia}
                type={cardType}
                isInWatchLater={isInWatchLater}
                size="default"
                fromUsername={rec.fromUsername ?? "Unknown"}
                fromUserImage={rec.fromUserImage}
                message={rec.message}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

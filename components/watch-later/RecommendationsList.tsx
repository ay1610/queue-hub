import React from "react";
import { MediaCard } from "../media-card/MediaCard";
import { MediaDetails } from "@/lib/tmdb/types";
import { TMDBMovie, TMDBTVShow } from "@/lib/types/tmdb";

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
    fromUserId: string;
    message: string;
  }>;
  details: Array<{ data?: MediaDetails } | undefined>;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  isLoading,
  error,
  recommendations,
  details,
}) => {
  if (isLoading) {
    // Show 8 skeleton cards for loading state
    return (
      <div className="grid grid-cols-2 md:grid-cols-8 gap-4 justify-center mb-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="animate-pulse">
            <div className="rounded-lg bg-gray-200 dark:bg-zinc-800 h-64 w-full mb-2" />
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
      <div className="grid grid-cols-2 md:grid-cols-8 gap-4 justify-center mb-6">
        {details.map((detailsObj, index) => {
          const rec = recommendations[index];
          console.log("Recommendation", rec);
          if (!detailsObj?.data || !rec) return null;
          return (
            <div key={`${rec.mediaType}-${rec.mediaId}-${rec.id}`}>
              {/* TODO: move this to a toolrip or modal
               <div className="border rounded p-3 bg-muted mb-2">
                <div className="text-sm text-muted-foreground mb-1">
                  <span>From: {rec.fromUserId}</span>
                </div>
                <div className="italic text-sm mt-1">&quot;{rec.message}&quot;</div>
              </div> */}
              {isMovie(detailsObj.data) ? (
                <MediaCard
                  media={detailsObj.data}
                  type="movie"
                  isInWatchLater={false}
                  size="small"
                />
              ) : (
                isTVShow(detailsObj.data) && (
                  <MediaCard
                    media={detailsObj.data}
                    type="tv"
                    isInWatchLater={false}
                    size="small"
                  />
                )
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

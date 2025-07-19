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

export interface WatchLaterListProps {
  isLoading: boolean;
  error: unknown;
  data: { mediaId: number; mediaType: string }[] | undefined;
  details: Array<{ data?: MediaDetails } | undefined>;
}

export const WatchLaterList: React.FC<WatchLaterListProps> = ({
  isLoading,
  error,
  data,
  details,
}) => {
  if (isLoading) {
    // Show 8 skeleton cards for loading state
    return (
      <div className="grid grid-cols-2 md:grid-cols-8 gap-4 justify-center">
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
  if (error) return <p>Error loading watch list</p>;
  if (!data || data.length === 0) return <p>Your watch list is empty</p>;

  return (
    <>
      <p>Found {data.length} items in your watch list</p>
      <div className="grid grid-cols-2 md:grid-cols-8 gap-4 justify-center">
        {data.map((item, index) => {
          const detailsObj = details[index];
          if (!detailsObj?.data) return null;
          return (
            <div key={`${item.mediaType}-${item.mediaId}`}>
              {isMovie(detailsObj.data) ? (
                <MediaCard
                  media={detailsObj.data}
                  type="movie"
                  isInWatchLater={true}
                  size="small"
                />
              ) : (
                isTVShow(detailsObj.data) && (
                  <MediaCard media={detailsObj.data} type="tv" isInWatchLater={true} size="small" />
                )
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useWatchLaterList } from "@/lib/watch-later-hooks";
import { useWatchLaterMediaInfo, MediaDetails } from "@/lib/watch-later-details-hooks";
import { TMDBMovie, TMDBTVShow } from "@/lib/types/tmdb";
import { MediaCard } from "../media-card/MediaCard";

/**
 * Type guard to check if media is a movie
 */
function isMovie(media: MediaDetails): media is TMDBMovie {
  return "title" in media;
}

/**
 * Type guard to check if media is a TV show
 */
function isTVShow(media: MediaDetails): media is TMDBTVShow {
  return "name" in media;
}

export default function WatchLater() {
  // Get the basic watch later list (IDs and media types)
  const {
    data: watchLaterData,
    error: watchLaterError,
    isLoading: isWatchLaterLoading,
  } = useWatchLaterList();

  // This returns an array of query results, one for each item in the watch later list
  // Each result contains detailed information about the media item
  const watchLaterDetails = useWatchLaterMediaInfo(watchLaterData?.data || []);

  // Log the watch later details to the console for debugging
  console.log("Watch Later Details:", watchLaterDetails);

  // Implement your UI here, using the data from the hooks
  return (
    <Card className={cn("w-full max-w-2xl mx-auto mt-10")}>
      <CardHeader>
        <h1 className="font-semibold text-2xl" data-slot="card-title">
          Watch List
        </h1>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement your custom UI here using the data from the hooks */}
        {isWatchLaterLoading && <p>Loading your watch list...</p>}
        {watchLaterError && <p>Error loading watch list</p>}
        {!isWatchLaterLoading &&
          !watchLaterError &&
          (!watchLaterData || watchLaterData.data.length === 0) && <p>Your watch list is empty</p>}
        {!isWatchLaterLoading &&
          !watchLaterError &&
          watchLaterData &&
          watchLaterData.data.length > 0 && (
            <>
              <p>Found {watchLaterData.data.length} items in your watch list</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
                {watchLaterData?.data.map((item, index) => {
                  const details = watchLaterDetails[index];

                  // Skip rendering if details aren't loaded yet
                  if (!details?.data) return null;

                  return (
                    <div key={`${item.mediaType}-${item.mediaId}`}>
                      {isMovie(details.data) ? (
                        <MediaCard media={details.data} type="movie" isInWatchLater={true} />
                      ) : (
                        isTVShow(details.data) && (
                          <MediaCard media={details.data} type="tv" isInWatchLater={true} />
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
      </CardContent>
    </Card>
  );
}

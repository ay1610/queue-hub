"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useWatchLaterList } from "@/lib/watch-later-hooks";
import type { WatchLaterMediaType } from "@/lib/types/watch-later";
import { useWatchLaterMediaInfo } from "@/lib/watch-later-details-hooks";
import { WatchLaterList } from "./WatchLaterList";
import { RecommendationsList } from "./RecommendationsList";

import { useRecommendations } from "@/lib/hooks/useRecommendations";

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

  // Fetch recommendations using custom hook
  const {
    data: recommendationsData,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
  } = useRecommendations();
  const recommendationsDetails = useWatchLaterMediaInfo(
    (recommendationsData?.recommendations || []).map((rec) => ({
      mediaType: rec.mediaType as WatchLaterMediaType,
      mediaId: rec.mediaId,
    }))
  );
  // Implement your UI here, using the data from the hooks
  return (
    <Card className={cn("w-3/4 mx-auto mt-10")}>
      {/* Recommendations Section */}
      <CardHeader>
        <h2 className="font-semibold text-xl" data-slot="card-title">
          Recommendations
        </h2>
      </CardHeader>
      <CardContent className="mb-10 pb-8 overflow-visible relative z-0">
        <RecommendationsList
          isLoading={isRecommendationsLoading}
          error={recommendationsError}
          recommendations={recommendationsData?.recommendations || []}
          details={recommendationsDetails}
        />
      </CardContent>
      <CardHeader className="mt-8 relative z-50">
        <h2 className="font-semibold text-2xl" data-slot="card-title">
          Watch List
        </h2>
      </CardHeader>
      <CardContent>
        <WatchLaterList
          isLoading={isWatchLaterLoading}
          error={watchLaterError}
          data={watchLaterData?.data}
          details={watchLaterDetails}
        />
      </CardContent>
    </Card>
  );
}

"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
// Will be used when feature is implemented
// import { useWatchLaterList } from "@/lib/watch-later-hooks";

export default function WatchLater() {
  // Commented out for now while the feature is in development
  // const { data: watchLaterData, error, isLoading } = useWatchLaterList();

  return (
    <Card className={cn("w-full max-w-2xl mx-auto mt-10")}>
      <CardHeader>
        <h1 className="font-semibold text-2xl" data-slot="card-title">
          Watch List
        </h1>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <h3 className="text-xl font-medium">Coming Soon</h3>
          <p className="text-center text-muted-foreground max-w-md">TBD</p>
        </div>

        {/* Original code commented out for reference
          {isLoading && <p className="text-center py-4">Loading your watch list...</p>}
          {error && <p className="text-red-500 text-center py-4">Error loading watch list</p>}
          {!isLoading && !error && !watchLaterData?.data.length && (
            <p className="text-muted-foreground text-center py-8">
              Your watch list is empty. Add movies or TV shows to get started.
            </p>
          )}
          {!isLoading && !error && watchLaterData && watchLaterData.data.length > 0 && (
            <div className="space-y-4">
              <p className="text-center">
                Found {watchLaterData.data.length} items in your watch list.
              </p>
            </div>
          )}
          */}
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import { useIsInWatchLater } from "@/lib/watch-later-store-hooks";
import { InteractiveMediaCard, type MediaCardWithActionButtonsProps } from "./MediaCardWithActionButtons";

// A thin wrapper that computes isInWatchLater to avoid repeating this logic across callers.
export type WatchLaterAwareCardProps = Omit<MediaCardWithActionButtonsProps, "isInWatchLater">;

export function InteractiveWatchLaterCard(props: WatchLaterAwareCardProps) {
    const { media, type } = props;
    // Always call the hook with a safe default; the hook signature expects WatchLaterMediaType
    const fallbackType = "movie" as const;
    const hookType = (type === "movie" || type === "tv" ? type : fallbackType);
    const hookValue = useIsInWatchLater(media.id, hookType);
    const isInWatchLater = type === "movie" || type === "tv" ? hookValue : false;

    return <InteractiveMediaCard {...props} isInWatchLater={isInWatchLater} />;
}

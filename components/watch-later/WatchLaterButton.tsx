"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useWatchLaterMutation } from "@/lib/watch-later-hooks";
import { WatchLaterMediaType } from "@/lib/types/watch-later";

interface WatchLaterButtonProps {
  mediaId: number;
  mediaType: WatchLaterMediaType;
  className?: string;
  isInWatchLater?: boolean;
}

export function WatchLaterButton({
  mediaId,
  mediaType,
  className,
  isInWatchLater = false,
}: WatchLaterButtonProps) {
  const [isInWatchLaterState, setIsInWatchLaterState] = useState(isInWatchLater);
  const watchLaterMutation = useWatchLaterMutation();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const action = isInWatchLaterState ? "remove" : "add";

    try {
      await watchLaterMutation.mutateAsync({ mediaId, mediaType, action });
      setIsInWatchLaterState(!isInWatchLaterState);
    } catch (error) {
      console.error("Error toggling watch-later:", error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={watchLaterMutation.isPending}
      variant="outline"
      size="icon"
      className={className}
    >
      {isInWatchLaterState ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </Button>
  );
}

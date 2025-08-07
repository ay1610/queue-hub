"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useWatchLaterMutation } from "@/lib/watch-later-hooks";
import { WatchLaterMediaType } from "@/lib/types/watch-later";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WatchLaterButtonProps {
  mediaId: number;
  mediaType: WatchLaterMediaType;
  className?: string;
  isInWatchLater?: boolean;
  title?: string; // Optional title for the media item to display in toast
}

export function WatchLaterButton({
  mediaId,
  mediaType,
  className,
  isInWatchLater = false,
  title,
}: WatchLaterButtonProps) {
  const [isInWatchLaterState, setIsInWatchLaterState] = useState(isInWatchLater);
  const watchLaterMutation = useWatchLaterMutation();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const action = isInWatchLaterState ? "remove" : "add";
    const toastOptions = { position: "bottom-center" as const };

    // Create toast messages with title if available
    const titlePrefix = title ? `"${title}"` : "Item";
    const loadingMessage =
      action === "add"
        ? `Adding ${titlePrefix} to watch list...`
        : `Removing ${titlePrefix} from watch list...`;
    const successMessage =
      action === "add"
        ? `${titlePrefix} added to watch list`
        : `${titlePrefix} removed from watch list`;
    const errorMessage = `Failed to ${action === "add" ? "add" : "remove"} ${titlePrefix.toLowerCase()}`;

    const toastId = toast.loading(loadingMessage, toastOptions);

    try {
      await watchLaterMutation.mutateAsync({ mediaId, mediaType, action });
      setIsInWatchLaterState(!isInWatchLaterState);

      // Show success toast
      toast.success(successMessage, {
        id: toastId,
        ...toastOptions,
      });
    } catch (error) {
      // Show error toast
      toast.error(errorMessage, {
        id: toastId,
        ...toastOptions,
      });
      console.error("Error toggling watch-later:", error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={watchLaterMutation.isPending}
      variant="outline"
      size="icon"
      className={cn("w-6 h-6 p-1", className)}
    >
      {isInWatchLaterState ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
    </Button>
  );
}

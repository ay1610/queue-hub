"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2 } from "lucide-react";
import { useWatchLaterMutation } from "@/lib/watch-later-hooks";
import { WatchLaterMediaType } from "@/lib/types/watch-later";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsInWatchLater } from "@/lib/watch-later-store-hooks";

interface WatchLaterButtonProps {
  mediaId: number;
  mediaType: WatchLaterMediaType;
  className?: string;
  isInWatchLater?: boolean;
  title?: string; // Optional title for the media item to display in toast
  /**
   * Force showing text label next to the icon. If undefined, we'll infer based on width classes
   * (w-auto or w-full). This avoids accidental text rendering for tiny icon buttons like w-8/w-9.
   */
  showText?: boolean;
  /** Optional override for the underlying button variant (default/outline/ghost/secondary) */
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
}

export function WatchLaterButton({
  mediaId,
  mediaType,
  className,
  isInWatchLater = false,
  title,
  showText,
  variant,
}: WatchLaterButtonProps) {
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const watchLaterMutation = useWatchLaterMutation();
  // Derive state from centralized store; fall back to prop pre-hydration to reduce flicker
  const selected = useIsInWatchLater(mediaId, mediaType);
  const effectiveSelected = selected || isInWatchLater;

  // Reset success animation after a while
  React.useEffect(() => {
    if (animateSuccess) {
      const timer = setTimeout(() => {
        setAnimateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [animateSuccess]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const action = effectiveSelected ? "remove" : "add";
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
      setAnimateSuccess(true);

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

  // Determine if button should show active state
  const isActive = effectiveSelected || animateSuccess;

  // Determine whether text is shown
  // Prefer explicit prop; otherwise only enable for wide buttons (w-auto or w-full)
  const hasTextClass =
    typeof showText === "boolean"
      ? showText
      : Boolean(className?.includes("w-auto") || className?.includes("w-full"));

  return (
    <Button
      onClick={handleClick}
      disabled={watchLaterMutation.isPending}
      variant={variant ?? (isActive ? "default" : "outline")}
      size={hasTextClass ? "sm" : "icon"}
      className={cn(
        "relative transition-all duration-200 group whitespace-nowrap",
        // Only apply filled active style if caller didn't supply a custom variant
        (!variant && isActive) && "bg-primary/90 text-primary-foreground hover:bg-primary",
        watchLaterMutation.isPending && "pointer-events-none",
        className
      )}
    >
      {watchLaterMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {isActive ? (
            <Check className={cn(
              "h-4 w-4 transition-all duration-300 ease-out group-hover:scale-110",
              hasTextClass ? "mr-1" : ""
            )} />
          ) : (
            <Plus className={cn(
              "h-4 w-4 transition-all duration-300 ease-out group-hover:scale-110",
              hasTextClass ? "mr-1" : ""
            )} />
          )}
          {hasTextClass && (
            <span className="text-xs font-medium whitespace-nowrap overflow-visible">
              {isActive ? "In Watch List" : "Watch Later"}
            </span>
          )}
        </>
      )}
    </Button>
  );
}

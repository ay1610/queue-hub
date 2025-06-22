import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

/**
 * Props for the MediaRatingBadge component.
 */
export interface MediaRatingBadgeProps {
  /**
   * The vote_average (0-10) from TMDB or other source.
   */
  voteAverage: number;
  /**
   * Optional: aria-label for accessibility.
   */
  label?: string;
  /**
   * Optional: size of the badge ('sm' | 'md' | 'lg'). Default is 'md'.
   */
  size?: "sm" | "md" | "lg";
}

/**
 * Returns the appropriate color classes for the badge based on the rating value.
 */
export function getRatingClasses(rating: number) {
  if (rating < 4) return { ratingColor: "bg-red-600", textColor: "text-white" };
  if (rating < 7) return { ratingColor: "bg-yellow-400", textColor: "text-black" };
  return { ratingColor: "bg-green-600", textColor: "text-white" };
}

// Helper to get size classes
const sizeMap = {
  sm: { sizeClasses: "w-7 h-7 text-xs", paddingClasses: "px-1 py-1 my-1" },
  md: { sizeClasses: "w-16 h-16 text-2xl", paddingClasses: "" },
  lg: { sizeClasses: "w-24 h-24 text-4xl", paddingClasses: "" },
};

/**
 * MediaRatingBadge displays a circular, color-coded badge for a media rating out of 10.
 * Green: ≥7, Yellow: 4–6.9, Red: <4.
 */
export function MediaRatingBadge({ voteAverage, label, size = "md" }: MediaRatingBadgeProps) {
  const rating = voteAverage || 0;
  const { ratingColor, textColor } = getRatingClasses(rating);
  const { sizeClasses, paddingClasses } = sizeMap[size] || sizeMap.md;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "flex items-center justify-center rounded-full font-bold shadow-lg border-4 border-white",
            ratingColor,
            textColor,
            sizeClasses,
            paddingClasses
          )}
          aria-label={`${label || "Audience Score"}: ${rating.toFixed(1)}`}
        >
          {rating.toFixed(1)}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {`${label || "Audience Score"}: ${rating.toFixed(1)}`}
      </TooltipContent>
    </Tooltip>
  );
}

import React from "react";
// import { cn } from "@/lib/utils";
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
  votes?: number | null;
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
// Removed unused sizeMap

const getGradient = (rating: number) => {
  if (rating >= 9) return "bg-gradient-to-r from-emerald-400 to-emerald-700"; // Excellent
  if (rating >= 8) return "bg-gradient-to-r from-lime-300 to-lime-600"; // Very Good
  if (rating >= 7) return "bg-gradient-to-r from-yellow-300 to-amber-500"; // Good
  if (rating >= 5) return "bg-gradient-to-r from-orange-400 to-orange-700"; // Average
  if (rating > 0) return "bg-gradient-to-r from-red-400 to-red-700"; // Poor
  return "bg-gradient-to-r from-gray-300 to-gray-500"; // No rating
};

/**
 * MediaRatingBadge displays a circular, color-coded badge for a media rating out of 10.
 * Green: ≥7, Yellow: 4–6.9, Red: <4.
 */
export function MediaRatingBadge({ voteAverage, votes = 0 }: Omit<MediaRatingBadgeProps, "size">) {
  const rating = voteAverage || 0;
  const label = votes === 0
    ? `Rating: ${rating.toFixed(1)} / 10`
    : `IMDB Rating: ${rating.toFixed(1)} / 10 with ${votes} votes`;
  const gradient = getGradient(rating);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* <span
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
        </span> */}
        <div
          className={`inline-flex items-center text-white text-sm font-bold px-3 py-1 rounded-md ${gradient}`}
        >
          <span className="mr-1">★</span> {rating.toFixed(1)}
        </div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CircularRatingProps {
  rating: number;
  source: string;
  className?: string;
  size?: "default" | "small"; // controls visual size
  showLabel?: boolean; // whether to show the source label below the circle
}

const RATING_THRESHOLDS = {
  high: 7.5,
  medium: 5,
};

const getRatingColor = (rating: number) => {
  if (rating >= RATING_THRESHOLDS.high) {
    return "text-green-500";
  }
  if (rating >= RATING_THRESHOLDS.medium) {
    return "text-yellow-500";
  }
  return "text-red-500";
};

export function CircularRating({ rating, source, className, size = "default", showLabel = true }: CircularRatingProps) {
  const radius = size === "small" ? 12 : 20;
  const box = size === "small" ? 30 : 50;
  const wrapperSize = size === "small" ? "h-8 w-8" : "h-16 w-16";
  const valueText = size === "small" ? "text-[10px] font-semibold" : "text-lg font-bold";
  const circumference = 2 * Math.PI * radius; // 2 * pi * radius
  const strokeWidth = size === "small" ? 3 : 4;
  const strokeDashoffset = circumference - (rating / 10) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className={cn("relative", wrapperSize)}>
        <svg className="h-full w-full" viewBox={`0 0 ${box} ${box}`}>
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={box / 2}
            cy={box / 2}
          />
          <circle
            className={cn("transition-all duration-500 ease-in-out", getRatingColor(rating))}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={box / 2}
            cy={box / 2}
            transform={`rotate(-90 ${box / 2} ${box / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(valueText, "text-white")}>
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
      {showLabel && source && (
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {source}
        </div>
      )}
    </div>
  );
}

import * as React from "react";

/**
 * BannerProps defines the props for the Banner component.
 * @param children - The content to display inside the banner.
 * @param className - Additional class names for custom styling.
 */
export interface BannerProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * Banner component for displaying important messages in a theme-aware, accessible way.
 * Uses Tailwind CSS for dark/light mode support.
 */
export function Banner({ children, className = "" }: BannerProps) {
  return (
    <div
      role="status"
      className={`w-full rounded-md px-4 py-2 mb-4 font-medium border border-gray-200 bg-muted text-muted-foreground shadow-sm transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

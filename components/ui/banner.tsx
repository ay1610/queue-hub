import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * BannerProps defines the props for the Banner component.
 * @param children - The content to display inside the banner.
 * @param className - Additional class names for custom styling.
 * @param variant - Banner style variant (default, gradient, outline, modern)
 * @param theme - Color theme (auto uses system preference, or force light/dark)
 */
export interface BannerProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly variant?: "default" | "gradient" | "outline" | "modern";
  readonly theme?: "auto" | "light" | "dark";
}

/**
 * Banner component for displaying important messages in a theme-aware, accessible way.
 * Uses Tailwind CSS for dark/light mode support and responsive design.
 */
export function Banner({
  children,
  className = "",
  variant = "default",
  theme = "auto"
}: BannerProps) {
  const baseStyles = "w-full rounded-lg px-4 py-3 mb-4 font-medium transition-all shadow-sm";

  const variantStyles = {
    default: "border border-gray-200 bg-muted text-muted-foreground dark:border-gray-700",
    gradient: {
      light: "text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700",
      dark: "text-white bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-900"
    },
    outline: "border-2 border-primary text-primary bg-transparent",
    modern: {
      light: "bg-white border-l-4 border-l-blue-500 shadow-md text-gray-800",
      dark: "bg-gray-900 border-l-4 border-l-blue-400 shadow-md text-gray-100"
    }
  };

  // Determine the correct variant style based on theme and variant
  let variantStyle = "";
  if (typeof variantStyles[variant] === "string") {
    variantStyle = variantStyles[variant] as string;
  } else {
    const themeSpecificStyles = variantStyles[variant] as Record<string, string>;
    if (theme === "auto") {
      variantStyle = `${themeSpecificStyles.light} dark:${themeSpecificStyles.dark}`;
    } else {
      variantStyle = themeSpecificStyles[theme];
    }
  }

  return (
    <div
      role="status"
      className={cn(baseStyles, variantStyle, className)}
    >
      {children}
    </div>
  );
}

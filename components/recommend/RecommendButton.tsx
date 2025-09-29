import * as React from "react";
import { Button } from "@/components/ui/button";
import { SendIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  onClick?: () => void;
  "aria-label"?: string;
  isLoading?: boolean;
  hasRecommended?: boolean;
  showText?: boolean;
}

/**
 * Reusable button for recommending a movie or TV show.
 * Includes support for loading state and text display.
 */
export function RecommendButton({
  onClick,
  "aria-label": ariaLabel = "Recommend to a Friend",
  isLoading = false,
  hasRecommended = false,
  showText = false,
  className,
  ...props
}: RecommendButtonProps) {
  return (
    <Button
      variant={hasRecommended ? "default" : "outline"}
      size={showText ? "sm" : "icon"}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "relative transition-all duration-200 group whitespace-nowrap",
        showText ? "px-4 py-1 h-8 w-auto" : "w-8 h-8 sm:w-9 sm:h-9 p-1.5 sm:p-2",
        hasRecommended && "bg-primary/90 text-primary-foreground hover:bg-primary",
        isLoading && "pointer-events-none",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <SendIcon className={cn(
            "h-4 w-4 transition-transform duration-300 ease-out",
            hasRecommended ? "text-primary-foreground" : "",
            showText ? "mr-1" : "h-full w-full",
            "group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
          )} />
          {showText && (
            <span className="text-xs font-medium whitespace-nowrap overflow-visible">
              {hasRecommended ? "Recommended" : "Recommend"}
            </span>
          )}
        </>
      )}
    </Button>
  );
}

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type RuntimeBadgeProps = {
  formattedRuntime: string;
  gradient?: string; // e.g. 'from-green-400 to-green-600'
  glass?: boolean;
  className?: string;
};

export function RuntimeBadge({
  formattedRuntime,
  gradient = "from-green-400 to-green-600",
  glass = false,
  className,
}: RuntimeBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            tabIndex={0}
            role="button"
            aria-label={
              formattedRuntime === "N/A" ? "Runtime not available" : `Runtime: ${formattedRuntime}`
            }
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              glass
                ? "bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/20 text-white"
                : `bg-gradient-to-r ${gradient} text-white`,
              className
            )}
          >
            ⏱ {formattedRuntime}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <span>
            {formattedRuntime === "N/A" ? "Not available" : `Runtime: ${formattedRuntime}`}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

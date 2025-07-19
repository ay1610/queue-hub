import * as React from "react";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

interface RecommendButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  onClick?: () => void;
  "aria-label"?: string;
}

/**
 * Reusable icon button for recommending a movie or TV show.
 * Accepts all standard button props and an onClick handler.
 */
export function RecommendButton({
  onClick,
  "aria-label": ariaLabel = "Recommend",
  ...props
}: RecommendButtonProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label={ariaLabel} {...props}>
      <SendIcon size={20} />
    </Button>
  );
}

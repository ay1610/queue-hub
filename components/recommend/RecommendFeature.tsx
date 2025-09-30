import React, { useState, useEffect } from "react";
import { RecommendButton } from "./RecommendButton";
import { RecommendDialog } from "./RecommendDialog";
import { useShareRecommendation } from "@/lib/hooks/useRecommendations";
import { toast } from "sonner";

interface RecommendFeatureProps {
  mediaId: number | undefined;
  mediaType: "movie" | "tv" | undefined;
  mediaTitle: string;
  showText?: boolean;
  className?: string;
}

export function RecommendFeature({
  mediaId,
  mediaType,
  mediaTitle,
  showText = false,
  className
}: RecommendFeatureProps) {
  const [open, setOpen] = useState(false);
  const [hasRecommended, setHasRecommended] = useState(false);
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const shareRecommendation = useShareRecommendation();

  // Reset success animation after a while
  useEffect(() => {
    if (animateSuccess) {
      const timer = setTimeout(() => {
        setAnimateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [animateSuccess]);

  // Internal submit handler
  const handleRecommendSubmit = async (toUserId: string, message: string) => {
    if (!mediaId || !mediaType || !message) return;
    shareRecommendation.mutate(
      {
        mediaId,
        mediaType,
        toUserId,
        message,
      },
      {
        onSuccess: () => {
          toast.success("Recommendation sent!");
          setHasRecommended(true);
          setAnimateSuccess(true);
          setOpen(false);
        },
        onError: (error) => {
          if (error?.message === "Already recommended") {
            toast.error("You have already recommended this.");
          } else {
            toast.error("Failed to send recommendation");
          }
          console.error("Error recommending:", error);
        },
      }
    );
  };

  return (
    <>
      <RecommendButton
        aria-label="Recommend to a Friend"
        // Prevent parent Link/navigation when clicking the recommend control
        onClick={(e?: React.MouseEvent) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setOpen(true);
        }}
        isLoading={shareRecommendation.isPending}
        hasRecommended={hasRecommended || animateSuccess}
        showText={showText}
        className={className}
      />
      <RecommendDialog
        open={open}
        onOpenChange={setOpen}
        mediaId={mediaId}
        mediaType={mediaType}
        mediaTitle={mediaTitle}
        onSubmit={handleRecommendSubmit}
      />
    </>
  );
}

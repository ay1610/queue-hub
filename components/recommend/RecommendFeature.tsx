import React, { useState } from "react";
import { RecommendButton } from "./RecommendButton";
import { RecommendDialog } from "./RecommendDialog";
import { useShareRecommendation } from "@/lib/hooks/useRecommendations";
import { toast } from "sonner";
interface RecommendFeatureProps {
  mediaId: number | undefined;
  mediaType: "movie" | "tv" | undefined;
  mediaTitle: string;
}

export function RecommendFeature({ mediaId, mediaType, mediaTitle }: RecommendFeatureProps) {
  const [open, setOpen] = useState(false);
  const shareRecommendation = useShareRecommendation();

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
      <RecommendButton aria-label="Recommend" onClick={() => setOpen(true)} />
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

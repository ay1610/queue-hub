import React, { useState } from "react";
import { RecommendButton } from "./RecommendButton";
import { RecommendDialog } from "./RecommendDialog";
import { useShareRecommendation } from "@/lib/hooks/useRecommendations";

interface RecommendFeatureProps {
  mediaId: number | undefined;
  mediaType: "movie" | "tv" | undefined;
  mediaTitle: string;
}

export function RecommendFeature({ mediaId, mediaType, mediaTitle }: RecommendFeatureProps) {
  const [open, setOpen] = useState(false);
  console.log("first", mediaId, mediaType, mediaTitle);
  const shareRecommendation = useShareRecommendation();

  // Internal submit handler
  const handleRecommendSubmit = async (toUserId: string, message: string) => {
    // TODO: Call your recommend API/hook here
    // await recommend({ mediaId, mediaType, toUserId, message });
    console.log(toUserId, message, mediaId, mediaType);
    if (!mediaId || !mediaType || !message) return;
    shareRecommendation.mutate({
      mediaId,
      mediaType,
      toUserId,
      message,
    });
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

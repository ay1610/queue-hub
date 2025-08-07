import React from "react";
import Image from "next/image";

interface RecommendationBubbleProps {
  fromUsername: string;
  fromUserImage?: string | null;
  message?: string | null;
}

export const RecommendationBubble: React.FC<RecommendationBubbleProps> = ({
  fromUsername,
  fromUserImage,
  message,
}) => {
  // Get initials from username (first letter of each word, up to 2 letters)
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join("");
  };

  return (
    <div className="flex flex-col items-center gap-1 mb-2 w-full">
      <span className="text-[11px] text-muted-foreground mb-0.5">Recommended by</span>
      <div className="flex items-center gap-2 mb-1">
        {fromUserImage ? (
          <Image
            src={fromUserImage}
            alt={`${fromUsername}'s avatar`}
            width={24}
            height={24}
            className="rounded-full border border-gray-300 dark:border-zinc-700"
          />
        ) : (
          <span
            className="rounded-full w-6 h-6 flex items-center justify-center bg-gray-200 text-xs font-bold text-gray-600 border border-gray-300 dark:border-zinc-700"
            aria-label="User initials"
          >
            {getInitials(fromUsername)}
          </span>
        )}
        <span className="text-xs font-medium text-foreground">{fromUsername}</span>
      </div>
      {message && (
        <span
          className="relative block bg-muted px-3 py-2 rounded-xl text-sm text-foreground text-center max-w-[95%] break-words whitespace-pre-line shadow-sm border border-gray-200 dark:border-zinc-700 before:content-[''] before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-3 before:h-3 before:bg-muted before:rotate-45 before:border-b before:border-r before:border-gray-200 before:dark:border-zinc-700 mt-0.5"
          title={message}
        >
          &ldquo;{message}&rdquo;
        </span>
      )}
    </div>
  );
};

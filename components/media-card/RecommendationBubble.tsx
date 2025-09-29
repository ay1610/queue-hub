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
      <span className="text-[11px] text-muted-foreground/90 mb-0.5">Recommended by</span>
      <div className="flex items-center gap-1.5 mb-0.5">
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
        <span className="text-[12px] font-medium text-foreground">{fromUsername}</span>
      </div>
      {message && (
        <div className="relative flex flex-col items-center w-full mt-0.5">
          <div
            className="relative block px-2.5 py-1.5 rounded-2xl text-[13px] leading-snug text-white/95 dark:text-white/95 text-center max-w-[88%] break-words whitespace-pre-line shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)]
                       bg-white/10 dark:bg-white/10 backdrop-blur-xl saturate-150 border border-white/10 ring-1 ring-white/20
                       after:content-[''] after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none after:bg-gradient-to-br after:from-white/20 after:via-white/8 after:to-transparent
                       max-h-20 overflow-hidden [mask-image:linear-gradient(to_bottom,black_92%,transparent)]"
            title={message}
            role="note"
            aria-label={`Recommendation message: ${message}`}
          >
            &ldquo;{message}&rdquo;
          </div>
          {/* Glass tail */}
          <span
            aria-hidden
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 block w-3 h-3 rotate-45 rounded-[4px]
                       bg-white/10 backdrop-blur-xl saturate-150 border border-white/10 ring-1 ring-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          />
        </div>
      )}
    </div>
  );
};

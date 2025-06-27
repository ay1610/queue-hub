import React from "react";
import Image from "next/image";

/**
 * Background component for a blurred, cinematic backdrop with gradient overlay.
 * Use globally or per-page for a consistent visual style.
 *
 * @param src - The image path (relative to public/)
 * @param children - The content to render above the background
 */
export function Background({
  src = "/sample-backdrop.jpg",
  children,
}: {
  src?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={src}
          alt="Backdrop"
          fill
          className="object-cover blur-md brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

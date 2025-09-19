import Image from "next/image";
import React from "react";

/**
 * MediaBackdrop displays a large, blurred, darkened backdrop image for hero sections.
 * @param src - The image URL (should be a TMDB backdrop path)
 * @param alt - The alt text for the image
 * @param heightClass - Optional Tailwind height classes (default: 'h-[60vh] md:h-[80vh]')
 */
export function MediaBackdrop({
  src,
  alt,
  heightClass = "h-[70vh] md:h-[80vh]",
}: {
  src: string;
  alt: string;
  heightClass?: string;
}) {
  return (
    <div className={`absolute inset-0 w-full overflow-hidden z-0 ${heightClass}`}>
      <Image src={src} alt={alt} fill className="object-cover object-top brightness-75" priority />
    </div>
  );
}

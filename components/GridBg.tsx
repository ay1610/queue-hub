import React from "react";

/**
 * GridBg renders a subtle SVG grid pattern as a background overlay.
 * Place this at the root or layout level for a modern, non-intrusive background.
 */
export const GridBg: React.FC = () => (
  <div className="absolute top-0 left-0 h-full w-full text-muted pointer-events-none select-none z-0">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="url(#smallGrid)" />
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    <div className="absolute bottom-0 h-[30dvh] w-full bg-gradient-to-t from-background to-transparent" />
  </div>
);

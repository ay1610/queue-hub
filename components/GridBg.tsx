import React from "react";

/**
 * GridBg renders a subtle SVG grid pattern as a background overlay.
 * Place this at the root or layout level for a modern, non-intrusive background.
 */
export const GridBg: React.FC = () => (
    <div className="absolute top-0 left-0 h-full w-full text-gray-300 dark:text-muted pointer-events-none select-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="filmStrip" width="72" height="48" patternUnits="userSpaceOnUse">
                    {/* frame outline */}
                    <rect x="4" y="4" width="64" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    {/* left perforations */}
                    <rect x="0" y="6" width="3" height="6" rx="1" fill="currentColor" opacity="0.35" />
                    <rect x="0" y="18" width="3" height="6" rx="1" fill="currentColor" opacity="0.35" />
                    <rect x="0" y="30" width="3" height="6" rx="1" fill="currentColor" opacity="0.35" />
                    {/* right perforations */}
                    <rect x="69" y="6" width="3" height="6" rx="1" fill="currentColor" opacity="0.35" />
                    <rect x="69" y="18" width="3" height="6" rx="1" fill="currentColor" opacity="0.35" />
                    <rect x="69" y="30" width="3" height="6" rx="1" fill="currentColor" opacity="0.35" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#filmStrip)" />
        </svg>
        <div className="absolute bottom-0 h-[30dvh] w-full bg-gradient-to-t from-background to-transparent" />
    </div>
);
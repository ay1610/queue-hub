import React from "react";

/**
 * GridBg renders a subtle SVG grid pattern as a background overlay.
 * Place this at the root or layout level for a modern, non-intrusive background.
 */
export const GridBg: React.FC = () => (
    <div className="absolute top-0 left-0 h-full w-full text-gray-300 dark:text-muted pointer-events-none select-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="roundedDashedGrid" width="64" height="64" patternUnits="userSpaceOnUse">
                    <rect x="6" y="6" width="28" height="28" rx="8" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" />
                    <rect x="36" y="10" width="16" height="16" rx="6" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    <rect x="18" y="38" width="20" height="20" rx="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" />
                    <rect x="48" y="48" width="10" height="10" rx="4" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#roundedDashedGrid)" />
        </svg>
        <div className="absolute bottom-0 h-[30dvh] w-full bg-gradient-to-t from-background to-transparent" />
    </div>
);
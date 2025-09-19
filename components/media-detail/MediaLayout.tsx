import React from "react";

interface MediaLayoutProps {
    backdrop?: React.ReactNode;
    children: React.ReactNode;
}

export function MediaLayout({ backdrop, children }: MediaLayoutProps) {
    return (
        <div className="relative min-h-[50vh] sm:min-h-[60vh] w-full pb-16 sm:pb-24">
            {/* Hero Section with Backdrop */}
            {backdrop}

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 px-4 pt-16 sm:pt-20 md:pt-32">
                    {children}
                </div>
            </div>
        </div>
    );
}
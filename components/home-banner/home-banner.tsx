import { Banner } from "@/components/ui/banner";

interface HomeBannerProps {
    userName: string;
}

/**
 * HomeBanner component displaying a welcome message and app description
 * with visually appealing gradient and decorative elements.
 */
export function HomeBanner({ userName }: HomeBannerProps) {
    return (
        <Banner
            variant="gradient"
            theme="auto"
            className="p-6 shadow-lg overflow-hidden relative z-10"
        >
            {/* Decorative elements for visual flair */}
            <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-300 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-300 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">Welcome to Queue Hub, {userName}!</h1>
                </div>

                <p className="text-sm md:text-base text-white ml-10 drop-shadow-sm font-medium">
                    Your personal entertainment tracker. Discover trending movies and TV shows,
                    build your watchlist, and never miss great content again.
                </p>

                <div className="ml-10 mt-2">
                    <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-white text-blue-800 font-medium shadow-sm">
                        New features available!
                    </span>
                </div>
            </div>
        </Banner>
    );
}
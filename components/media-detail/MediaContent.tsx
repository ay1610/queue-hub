import { MediaRatingBadge } from "../media-rating-badge";
import { MediaTrailerDialog } from "../media-trailer-dialog";
import { RecommendFeature } from "../recommend/RecommendFeature";
import { WatchLaterButton } from "../watch-later/WatchLaterButton";
import type { TMDBVideo } from "@/lib/types/tmdb/videos";

interface MediaContentProps {
    title: string;
    tagline?: string;
    overview?: string;
    genres?: Array<{ id: number; name: string }>;
    trailer?: TMDBVideo;
    runtimeMins?: string;
    mediaId?: number;
    mediaType?: "movie" | "tv";
    imdbRating?: number;
    imdbVotes?: number;
    isInWatchLater?: boolean; // optional flag to indicate existing watch list state
}

export function MediaContent({
    title,
    tagline,
    overview,
    genres,
    trailer,
    runtimeMins,
    mediaId,
    mediaType,
    imdbRating,
    imdbVotes,
    isInWatchLater,
}: MediaContentProps) {
    return (
        <div className="flex-grow">
            <div className="bg-black/60 dark:bg-zinc-900/70 rounded-lg shadow-lg p-4 md:p-6">
                {/* Title & Basic Info */}
                <div className="mb-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow">{title}</h1>
                    {tagline && <p className="mt-1 italic text-base sm:text-lg text-gray-200">{tagline}</p>}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {imdbRating && <MediaRatingBadge voteAverage={imdbRating} votes={imdbVotes} />}
                        {runtimeMins && <span className="text-sm text-gray-300">Runtime: {runtimeMins}</span>}
                    </div>
                </div>

                {/* Genres */}
                {genres && genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="bg-white/80 dark:bg-zinc-800/80 text-gray-900 dark:text-gray-100 px-2 py-0.5 rounded-full text-xs font-medium"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons with full text for better UX */}
                <div className="flex items-center gap-2 mb-4 flex-wrap" role="group" aria-label="Media actions">
                    <MediaTrailerDialog trailer={trailer} />
                    {mediaId && mediaType && (
                        <WatchLaterButton
                            mediaId={mediaId}
                            mediaType={mediaType}
                            isInWatchLater={isInWatchLater}
                            title={title}
                            className="w-auto h-9 px-3" /* w-auto triggers text rendering in WatchLaterButton */
                        />
                    )}
                    {mediaId && mediaType && (
                        <RecommendFeature
                            mediaId={mediaId}
                            mediaType={mediaType}
                            mediaTitle={title}
                            showText={true}
                            className="h-9 px-3"
                        />
                    )}
                </div>

                {/* Overview */}
                {overview && (
                    <p className="text-sm sm:text-base leading-relaxed text-gray-100 dark:text-gray-300">
                        {overview}
                    </p>
                )}
            </div>
        </div>
    );
}
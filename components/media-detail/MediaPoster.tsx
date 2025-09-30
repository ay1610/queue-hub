import Image from "next/image";

interface MediaPosterProps {
    path: string | null;
    alt: string;
}

export function MediaPoster({ path, alt }: MediaPosterProps) {
    if (!path) return null;

    return (
        <div className="md:w-48 flex-shrink-0">
            <div className="md:sticky md:top-8 -mt-12 sm:-mt-16 md:mt-0 mx-auto md:mx-0">
                <div className="w-32 sm:w-40 md:w-48 shadow-xl rounded-lg overflow-hidden border-2 border-white dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <Image
                        src={`https://image.tmdb.org/t/p/w342${path}`}
                        alt={alt}
                        width={342}
                        height={513}
                        className="w-full h-auto"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
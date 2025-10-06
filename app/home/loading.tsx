import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
    return (
        <main className="container mx-auto px-4 py-8" aria-label="Home Page Loading">
            {/* Banner skeleton */}
            <div className="w-full h-16 rounded-lg bg-muted animate-pulse" />

            {/* Trending Movies section skeleton */}
            <section className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
                <div className="grid grid-flow-col gap-4 overflow-hidden">
                    {Array(4).fill(0).map((_, i) => (
                        <Skeleton
                            key={`movie-${i}`}
                            className="h-[280px] w-[200px] rounded-lg"
                        />
                    ))}
                </div>
            </section>

            {/* Trending TV Shows section skeleton */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
                <div className="grid grid-flow-col gap-4 overflow-hidden">
                    {Array(4).fill(0).map((_, i) => (
                        <Skeleton
                            key={`tv-${i}`}
                            className="h-[280px] w-[200px] rounded-lg"
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
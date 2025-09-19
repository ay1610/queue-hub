
import { getProtectedUser } from "@/lib/auth-helpers";
import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeBanner } from "@/components/home-banner";
import TrendingMoviesSection from "./TrendingMoviesSection";
import TrendingTVShowsSection from "./TrendingTVShowsSection";

export const metadata: Metadata = {
  title: "Home | Queue Hub",
  description: "Discover trending movies and TV shows to add to your watch queue",
  openGraph: {
    title: "Queue Hub - Your Personal Entertainment Tracker",
    description: "Discover trending movies and TV shows to add to your watch queue",
    type: "website",
  },
};

export default async function Page() {
  const user = await getProtectedUser();

  return (
    <main className="container mx-auto px-4 py-8" aria-label="Home Page">
      <HomeBanner userName={user?.name || "User"} />

      <Suspense fallback={
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
      }>
        <TrendingMoviesSection />
      </Suspense>

      <Suspense fallback={
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
      }>
        <TrendingTVShowsSection />
      </Suspense>
    </main>
  );
}
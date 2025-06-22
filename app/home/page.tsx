import { getProtectedUser } from "@/lib/auth-helpers";
import { TrendingMovies } from "@/components/trending-movies";
import { Banner } from "@/components/ui/banner";

export default async function HomePage() {
  const user = await getProtectedUser();
  return (
    <>
      <Banner>{`Welcome, ${user?.name}! Email: ${user?.email}`}</Banner>
      <TrendingMovies />
    </>
  );
}

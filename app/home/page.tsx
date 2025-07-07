import { getProtectedUser } from "@/lib/auth-helpers";
import { TrendingMoviesClient } from "@/components/trending-movies/TrendingMoviesClient";
import { Banner } from "@/components/ui/banner";

export default async function Page() {
  const user = await getProtectedUser();
  return (
    <>
      <Banner>{`Welcome, ${user?.name}! Email: ${user?.email}`}</Banner>
      <TrendingMoviesClient />
    </>
  );
}

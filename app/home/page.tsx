import { getProtectedUser } from "@/lib/auth-helpers";
import { Banner } from "@/components/ui/banner";
import TrendingMoviesPage from "../trending/movies/page";

export default async function Page() {
  const user = await getProtectedUser();
  return (
    <>
      <Banner>{`Welcome, ${user?.name}! Email: ${user?.email}`}</Banner>
      <TrendingMoviesPage />
    </>
  );
}

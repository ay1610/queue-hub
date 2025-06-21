import { getProtectedUser } from "@/lib/auth-helpers";
import { TrendingMovies } from "@/components/trending-movies";

export default async function HomePage() {
  const user = await getProtectedUser();
  return (
    <>
      <p className="mt-2 text-base text-gray-600 bg-white rounded shadow px-4 py-2">
        {`Welcome, ${user?.name}! Email: ${user?.email}`}
      </p>
      <TrendingMovies />
    </>
  );
}

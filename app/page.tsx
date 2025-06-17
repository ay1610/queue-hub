import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TrendingMovies } from "@/components/trending-movies";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      <p className="mt-2 text-base text-gray-600 bg-white rounded shadow px-4 py-2">
        {`Welcome, ${user?.name}! Email: ${user?.email}`}
      </p>
      <TrendingMovies />
    </>
  );
}

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Welcome to the Home Page</h1>
        <p className="mt-2 text-lg text-gray-600 bg-white rounded-lg shadow px-6 py-4">
          Welcome, <span className="font-semibold text-blue-600">{user?.name}</span>!<br />
          Your email is <span className="font-semibold text-blue-600">{user?.email}</span>.
        </p>
      </div>
    </>
  );
}

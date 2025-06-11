import { BookMarked } from "lucide-react";
import Link from "next/link";

export default async function Navbar() {
    //   const session = await auth.api.getSession({
    //     headers: await headers()
    //   });

    return (
        <div className="border-b px-4">
            <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
                <Link href='/' className="flex items-center gap-2">
                    <BookMarked className="h-6 w-6" />
                    <span className="font-bold">Queue Hub.</span>
                </Link>
                <div>
                    <Link href='/sign-in' className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        Sign In
                    </Link>
                    <Link href='/sign-up' className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                        Sign Up
                    </Link>
                </div>

            </div>
        </div>
    )
}

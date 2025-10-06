"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function HomeError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-center max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
                <p className="text-muted-foreground mb-6">
                    We couldn&apos;t load the content you requested. This might be due to a temporary issue or network problem.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button onClick={reset} variant="default">
                        Try again
                    </Button>
                    <Button onClick={() => window.location.href = "/"} variant="outline">
                        Go to homepage
                    </Button>
                </div>
            </div>
        </main>
    );
}
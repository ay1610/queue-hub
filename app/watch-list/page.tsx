import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getProtectedUser } from "@/lib/auth-helpers";

export default async function Page() {
  await getProtectedUser(); // Redirects to sign-in if not authenticated
  return (
    <Card className={cn("w-full max-w-2xl mx-auto mt-10")}>
      <CardHeader>
        <h1 className="font-semibold text-2xl" data-slot="card-title">
          Watch List
        </h1>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Watch list feature is currently unavailable.
        </p>
      </CardContent>
    </Card>
  );
}

"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function WatchLater() {
  const [count, setCount] = useState(0);
  return (
    <Card className={cn("w-full max-w-2xl mx-auto mt-10")}>
      <CardHeader>
        <h1 className="font-semibold text-2xl" data-slot="card-title">
          Watch List -- {count}
          <Button onClick={() => setCount(count + 1)}>Click</Button>
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

import React from "react";
import { getProtectedUser } from "@/lib/auth-helpers";
import WatchLater from "@/components/watch-later/WatchLater";

export default async function Page() {
  await getProtectedUser(); // Redirects to sign-in if not authenticated
  return <WatchLater></WatchLater>;
}

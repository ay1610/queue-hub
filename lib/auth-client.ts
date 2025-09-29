import { createAuthClient } from "better-auth/react";

// Ensure client-side calls use same-origin to avoid CORS/mixed-content issues.
// On the server (rare for this client), fall back to env or localhost.
const baseURL =
  typeof window !== "undefined"
    ? "" // same-origin relative
    : process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({ baseURL });

export const { signIn, signOut, useSession } = authClient;

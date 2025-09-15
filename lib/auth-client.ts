import { createAuthClient } from "better-auth/react";

// Use NEXT_PUBLIC_AUTH_URL for production (Vercel), fallback to localhost for local development
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000", // DO NOT use localhost in production
});

export const { signIn, signOut, useSession } = authClient;

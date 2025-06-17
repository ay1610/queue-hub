// Reusable TMDB API fetcher utility
/**
 * Fetches data from the TMDB API with the provided endpoint and options.
 *
 * @template T - The expected response type.
 * @param endpoint - The TMDB API endpoint (e.g., '/movie/popular').
 * @param options - Optional fetch options.
 * @returns A promise resolving to the parsed response of type T.
 * @throws If the API key is missing or the response is not OK.
 */
export async function tmdbFetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Only use server-side environment variable for the API key
  const apiKey = process.env.TMDB_API_KEY;
  const baseUrl = process.env.TMDB_URL || "https://api.themoviedb.org/3";
  if (!apiKey)
    throw new Error("TMDB API key is missing. Ensure TMDB_API_KEY is set on the server.");
  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch from TMDB");
  }
  return res.json();
}

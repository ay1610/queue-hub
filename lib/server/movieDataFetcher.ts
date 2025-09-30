import type { TMDBMovie } from "@/lib/types/tmdb";
import { cookies, headers } from "next/headers";

export async function fetchBatchExternalIds(
  mediaType: "movie" | "tv",
  tmdbIds: number[]
): Promise<{ imdb_id?: string | null }[] | null> {
  if (!tmdbIds.length) return [];

  try {
    const hdrs = await headers();
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      hdrs.get("origin") ||
      `http://${hdrs.get("host") || "localhost:3000"}`;
    const cookieHeader = cookies().toString();
    const res = await fetch(`${baseUrl}/api/media/external-ids/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ tmdbIds, mediaType }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Batch external IDs fetch failed:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching batch external IDs:", error);
    return null;
  }
}

export async function fetchBatchRuntime(
  imdbIds: string[]
): Promise<{ tconst: string; runtime_minutes: number | null }[] | null> {
  if (!imdbIds.length) return [];

  try {
    const hdrs = await headers();
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      hdrs.get("origin") ||
      `http://${hdrs.get("host") || "localhost:3000"}`;
    const cookieHeader = cookies().toString();
    const res = await fetch(`${baseUrl}/api/run-time/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ imdbIds }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Batch runtime fetch failed:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching batch runtime:", error);
    return null;
  }
}

export async function fetchBatchRatings(
  imdbIds: string[]
): Promise<{ tconst: string; averageRating: number | null; numVotes: number | null }[] | null> {
  if (!imdbIds.length) return [];

  try {
    const hdrs = await headers();
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      hdrs.get("origin") ||
      `http://${hdrs.get("host") || "localhost:3000"}`;
    const cookieHeader = cookies().toString();
    const res = await fetch(`${baseUrl}/api/title-rating/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ imdbIds }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Batch ratings fetch failed:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching batch ratings:", error);
    return null;
  }
}

export function aggregateMovieData(
  movies: TMDBMovie[],
  externalIdsBatch: { imdb_id?: string | null }[] | null,
  runtimeBatch: { tconst: string; runtime_minutes: number | null }[] | null,
  ratingBatch: { tconst: string; averageRating: number | null; numVotes: number | null }[] | null
): Map<
  number,
  {
    imdbRuntime?: { tconst: string; runtime_minutes: number | null };
    imdbRating?: { tconst: string; averageRating: number | null; numVotes: number | null };
  }
> {
  const movieDataMap = new Map();

  const runtimeMap = new Map((runtimeBatch || []).map((item) => [item.tconst, item]));
  const ratingMap = new Map((ratingBatch || []).map((item) => [item.tconst, item]));

  movies.forEach((movie, index) => {
    const externalId = externalIdsBatch?.[index];
    const imdbId = externalId?.imdb_id;

    if (imdbId) {
      const runtime = runtimeMap.get(imdbId);
      const rating = ratingMap.get(imdbId);

      if (runtime || rating) {
        movieDataMap.set(movie.id, {
          ...(runtime && { imdbRuntime: runtime }),
          ...(rating && { imdbRating: rating }),
        });
      }
    }
  });

  return movieDataMap;
}

export async function fetchEnrichedMovieData(movies: TMDBMovie[]) {
  if (!movies.length) return { movies, movieDataMap: new Map() };
  const tmdbIds = movies.map((movie) => movie.id);
  const externalIdsBatch = await fetchBatchExternalIds("movie", tmdbIds);
  const imdbIds = (externalIdsBatch || [])
    .map((ext) => ext?.imdb_id)
    .filter((id): id is string => !!id);
  const [runtimeBatch, ratingBatch] = await Promise.all([
    fetchBatchRuntime(imdbIds),
    fetchBatchRatings(imdbIds),
  ]);
  const movieDataMap = aggregateMovieData(movies, externalIdsBatch, runtimeBatch, ratingBatch);
  return { movies, movieDataMap };
}

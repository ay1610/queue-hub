import type { TMDBMovie } from "@/lib/types/tmdb";
import { postBatch } from "./batchApi";

export async function fetchBatchExternalIds(
  mediaType: "movie" | "tv",
  tmdbIds: number[]
): Promise<{ imdb_id?: string | null }[] | null> {
  if (!tmdbIds.length) return [];
  return await postBatch<{ tmdbIds: number[]; mediaType: string }, { imdb_id?: string | null }>(
    "/api/media/external-ids/batch",
    { tmdbIds, mediaType }
  );
}

export async function fetchBatchRuntime(
  imdbIds: string[]
): Promise<{ tconst: string; runtime_minutes: number | null }[] | null> {
  if (!imdbIds.length) return [];
  return await postBatch<{ imdbIds: string[] }, { tconst: string; runtime_minutes: number | null }>(
    "/api/run-time/batch",
    { imdbIds }
  );
}

export async function fetchBatchRatings(
  imdbIds: string[]
): Promise<{ tconst: string; averageRating: number | null; numVotes: number | null }[] | null> {
  if (!imdbIds.length) return [];
  return await postBatch<
    { imdbIds: string[] },
    { tconst: string; averageRating: number | null; numVotes: number | null }
  >("/api/title-rating/batch", { imdbIds });
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

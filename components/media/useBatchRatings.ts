import { useQuery } from "@tanstack/react-query";

export type TitleRatingResult = {
  tconst: string;
  averageRating: number | null;
  numVotes: number | null;
};

export function useBatchRatings(imdbIds: string[]) {
  return useQuery<TitleRatingResult[]>({
    queryKey: ["title-rating-batch", imdbIds],
    queryFn: async () => {
      if (!imdbIds.length) return [];
      const res = await fetch("/api/title-rating/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbIds }),
      });
      if (!res.ok) throw new Error("Batch fetch failed");
      const json = await res.json();
      return json.data;
    },
    enabled: imdbIds.length > 0,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}

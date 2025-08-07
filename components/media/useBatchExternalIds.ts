import { useQuery } from "@tanstack/react-query";

export function useBatchExternalIds(mediaType: "tv" | "movie", tmdbIds: number[]) {
  return useQuery({
    queryKey: ["media-external-ids-batch", mediaType, tmdbIds],
    queryFn: async () => {
      if (!tmdbIds.length) return [];
      const res = await fetch("/api/media/external-ids/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbIds, mediaType }),
      });
      if (!res.ok) throw new Error("Batch external ids fetch failed");
      const json = await res.json();
      return json.data;
    },
    enabled: tmdbIds.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

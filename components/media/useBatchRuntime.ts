import { useQuery } from "@tanstack/react-query";

export type RuntimeDataResult = {
  tconst: string;
  title_type: string | null;
  primary_title: string | null;
  runtime_minutes: number | null;
};

export function useBatchRuntime(imdbIds: string[]) {
  return useQuery<RuntimeDataResult[]>({
    queryKey: ["runtime-batch", imdbIds],
    queryFn: async () => {
      if (!imdbIds.length) return [];
      const res = await fetch("/api/run-time/batch", {
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

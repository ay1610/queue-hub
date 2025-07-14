import { useQuery } from "@tanstack/react-query";

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreListResponse {
  genres: TMDBGenre[];
}

async function fetchTVGenres(): Promise<TMDBGenreListResponse> {
  const res = await fetch("https://api.themoviedb.org/3/genre/tv/list?language=en", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
      accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch TV genres");
  return res.json();
}

export function useTVGenres() {
  return useQuery<TMDBGenreListResponse, Error>({
    queryKey: ["tv-genres"],
    queryFn: fetchTVGenres,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

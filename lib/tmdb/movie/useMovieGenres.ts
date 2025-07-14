import { useQuery } from "@tanstack/react-query";

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreListResponse {
  genres: TMDBGenre[];
}

async function fetchMovieGenres(): Promise<TMDBGenreListResponse> {
  const res = await fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
      accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch movie genres");
  return res.json();
}

export function useMovieGenres() {
  return useQuery<TMDBGenreListResponse, Error>({
    queryKey: ["movie-genres"],
    queryFn: fetchMovieGenres,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

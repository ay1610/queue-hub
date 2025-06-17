import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { tmdbClient } from "./client";
import type {
  TMDBMovieFilters,
  TMDBTVFilters,
  TMDBMediaType,
  TMDBTimeWindow,
} from "./types";

// Query key factory for better cache management
export const tmdbKeys = {
  all: ["tmdb"] as const,
  searches: () => [...tmdbKeys.all, "search"] as const,
  search: (type: string, query: string) => [...tmdbKeys.searches(), type, query] as const,
  movies: () => [...tmdbKeys.all, "movies"] as const,
  movie: (id: number) => [...tmdbKeys.movies(), id] as const,
  movieLists: () => [...tmdbKeys.movies(), "lists"] as const,
  movieList: (type: string, page?: number) => [...tmdbKeys.movieLists(), type, page] as const,
  movieDiscover: (filters: TMDBMovieFilters) => [...tmdbKeys.movies(), "discover", filters] as const,
  tvShows: () => [...tmdbKeys.all, "tv"] as const,
  tvShow: (id: number) => [...tmdbKeys.tvShows(), id] as const,
  tvLists: () => [...tmdbKeys.tvShows(), "lists"] as const,
  tvList: (type: string, page?: number) => [...tmdbKeys.tvLists(), type, page] as const,
  tvDiscover: (filters: TMDBTVFilters) => [...tmdbKeys.tvShows(), "discover", filters] as const,
  trending: (mediaType?: TMDBMediaType, timeWindow?: TMDBTimeWindow) => 
    [...tmdbKeys.all, "trending", mediaType, timeWindow] as const,
  genres: () => [...tmdbKeys.all, "genres"] as const,
  movieGenres: () => [...tmdbKeys.genres(), "movies"] as const,
  tvGenres: () => [...tmdbKeys.genres(), "tv"] as const,
  people: () => [...tmdbKeys.all, "people"] as const,
  person: (id: number) => [...tmdbKeys.people(), id] as const,
  configuration: () => [...tmdbKeys.all, "configuration"] as const,
};

// Search hooks
export function useSearchMulti(query: string, page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.search("multi", `${query}-${page}`),
    queryFn: () => tmdbClient.searchMulti(query, page),
    enabled: query.length >= 3, // Only search when query is at least 3 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

export function useSearchMovies(query: string, page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.search("movies", `${query}-${page}`),
    queryFn: () => tmdbClient.searchMovies(query, page),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSearchTVShows(query: string, page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.search("tv", `${query}-${page}`),
    queryFn: () => tmdbClient.searchTVShows(query, page),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSearchPeople(query: string, page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.search("people", `${query}-${page}`),
    queryFn: () => tmdbClient.searchPeople(query, page),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Infinite search hooks for pagination
export function useInfiniteSearchMovies(query: string) {
  return useInfiniteQuery({
    queryKey: tmdbKeys.search("movies-infinite", query),
    queryFn: ({ pageParam = 1 }) => tmdbClient.searchMovies(query, pageParam),
    enabled: query.length >= 3,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Movie hooks
export function useMovie(id: number) {
  return useQuery({
    queryKey: tmdbKeys.movie(id),
    queryFn: () => tmdbClient.getMovie(id),
    staleTime: 30 * 60 * 1000, // 30 minutes - movie details don\'t change often
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function usePopularMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.movieList("popular", page),
    queryFn: () => tmdbClient.getPopularMovies(page),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
  });
}

export function useTopRatedMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.movieList("top-rated", page),
    queryFn: () => tmdbClient.getTopRatedMovies(page),
    staleTime: 60 * 60 * 1000, // 1 hour - top rated changes slowly
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

export function useUpcomingMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.movieList("upcoming", page),
    queryFn: () => tmdbClient.getUpcomingMovies(page),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,
  });
}

export function useNowPlayingMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.movieList("now-playing", page),
    queryFn: () => tmdbClient.getNowPlayingMovies(page),
    staleTime: 10 * 60 * 1000, // 10 minutes - changes more frequently
    gcTime: 30 * 60 * 1000,
  });
}

export function useDiscoverMovies(filters: TMDBMovieFilters = {}) {
  return useQuery({
    queryKey: tmdbKeys.movieDiscover(filters),
    queryFn: () => tmdbClient.discoverMovies(filters),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// Infinite movie hooks
export function useInfinitePopularMovies() {
  return useInfiniteQuery({
    queryKey: tmdbKeys.movieList("popular-infinite"),
    queryFn: ({ pageParam = 1 }) => tmdbClient.getPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// TV Show hooks
export function useTVShow(id: number) {
  return useQuery({
    queryKey: tmdbKeys.tvShow(id),
    queryFn: () => tmdbClient.getTVShow(id),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function usePopularTVShows(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.tvList("popular", page),
    queryFn: () => tmdbClient.getPopularTVShows(page),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useTopRatedTVShows(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.tvList("top-rated", page),
    queryFn: () => tmdbClient.getTopRatedTVShows(page),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
}

export function useOnTheAirTVShows(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.tvList("on-the-air", page),
    queryFn: () => tmdbClient.getOnTheAirTVShows(page),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useAiringTodayTVShows(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.tvList("airing-today", page),
    queryFn: () => tmdbClient.getAiringTodayTVShows(page),
    staleTime: 5 * 60 * 1000, // 5 minutes - changes frequently
    gcTime: 15 * 60 * 1000,
  });
}

export function useDiscoverTVShows(filters: TMDBTVFilters = {}) {
  return useQuery({
    queryKey: tmdbKeys.tvDiscover(filters),
    queryFn: () => tmdbClient.discoverTVShows(filters),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// Trending hooks
export function useTrending(
  mediaType: TMDBMediaType = "all",
  timeWindow: TMDBTimeWindow = "week"
) {
  return useQuery({
    queryKey: tmdbKeys.trending(mediaType, timeWindow),
    queryFn: () => tmdbClient.getTrending(mediaType, timeWindow),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,
  });
}

// Genre hooks
export function useMovieGenres() {
  return useQuery({
    queryKey: tmdbKeys.movieGenres(),
    queryFn: () => tmdbClient.getMovieGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - genres rarely change
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function useTVGenres() {
  return useQuery({
    queryKey: tmdbKeys.tvGenres(),
    queryFn: () => tmdbClient.getTVGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Person hooks
export function usePerson(id: number) {
  return useQuery({
    queryKey: tmdbKeys.person(id),
    queryFn: () => tmdbClient.getPerson(id),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Configuration hook
export function useConfiguration() {
  return useQuery({
    queryKey: tmdbKeys.configuration(),
    queryFn: () => tmdbClient.getConfiguration(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - configuration rarely changes
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Utility hook for getting image URLs
export function useImageUrls() {
  return {
    getImageUrl: tmdbClient.getImageUrl.bind(tmdbClient),
    getBackdropUrl: tmdbClient.getBackdropUrl.bind(tmdbClient),
  };
}

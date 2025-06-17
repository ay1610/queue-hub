# TMDB API Integration

This module provides a comprehensive TypeScript wrapper for The Movie Database (TMDB) API with TanStack Query integration for optimal caching and data fetching.

## Features

- ✅ **Complete TypeScript Support** - Fully typed responses and parameters
- ✅ **TanStack Query Integration** - Optimized caching, background updates, and error handling
- ✅ **Native Fetch API** - No external HTTP client dependencies, uses browser's native fetch
- ✅ **Image URL Helpers** - Easy image URL generation with different sizes
- ✅ **Error Handling** - Comprehensive error handling with retry logic
- ✅ **Development Tools** - React Query DevTools integration for debugging
- ✅ **Best Practices** - Optimized cache times and query keys

## Setup

1. Set your TMDB API key in environment variables:

```bash
# .env.local
TMDB_API_KEY="your_tmdb_bearer_token"
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL="https://image.tmdb.org/t/p"
```

2. The QueryClient is already configured in the Providers component.

## Usage Examples

### Basic Movie Search

```tsx
import { useSearchMovies, tmdb } from "@/lib/tmdb";

function MovieSearch() {
  const { data, isLoading, error } = useSearchMovies("inception", 1);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.results.map((movie) => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <img src={tmdb.getImageUrl(movie.poster_path, "w342")} alt={movie.title} />
        </div>
      ))}
    </div>
  );
}
```

### Popular Movies with Infinite Scroll

```tsx
import { useInfinitePopularMovies } from "@/lib/tmdb";

function PopularMovies() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfinitePopularMovies();

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
```

### Movie Details

```tsx
import { useMovie } from "@/lib/tmdb";

function MovieDetails({ movieId }: { movieId: number }) {
  const { data: movie, isLoading } = useMovie(movieId);

  if (isLoading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <p>Runtime: {movie.runtime} minutes</p>
      <p>Rating: {movie.vote_average}/10</p>
      {movie.genres?.map((genre) => (
        <span key={genre.id}>{genre.name}</span>
      ))}
    </div>
  );
}
```

### Discovery with Filters

```tsx
import { useDiscoverMovies } from "@/lib/tmdb";

function DiscoverMovies() {
  const { data } = useDiscoverMovies({
    sort_by: "popularity.desc",
    with_genres: "28,12", // Action & Adventure
    primary_release_year: 2024,
    vote_average_gte: 7.0,
  });

  return (
    <div>
      {data?.results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

## Available Hooks

### Search Hooks

- `useSearchMulti(query, page)` - Search across movies, TV shows, and people
- `useSearchMovies(query, page)` - Search movies only
- `useSearchTVShows(query, page)` - Search TV shows only
- `useSearchPeople(query, page)` - Search people only
- `useInfiniteSearchMovies(query)` - Infinite scroll search for movies

### Movie Hooks

- `useMovie(id)` - Get movie details
- `usePopularMovies(page)` - Get popular movies
- `useTopRatedMovies(page)` - Get top rated movies
- `useUpcomingMovies(page)` - Get upcoming movies
- `useNowPlayingMovies(page)` - Get now playing movies
- `useDiscoverMovies(filters)` - Discover movies with filters
- `useInfinitePopularMovies()` - Infinite scroll popular movies

### TV Show Hooks

- `useTVShow(id)` - Get TV show details
- `usePopularTVShows(page)` - Get popular TV shows
- `useTopRatedTVShows(page)` - Get top rated TV shows
- `useOnTheAirTVShows(page)` - Get on-the-air TV shows
- `useAiringTodayTVShows(page)` - Get airing today TV shows
- `useDiscoverTVShows(filters)` - Discover TV shows with filters

### Other Hooks

- `useTrending(mediaType, timeWindow)` - Get trending content
- `useMovieGenres()` - Get movie genres list
- `useTVGenres()` - Get TV genres list
- `usePerson(id)` - Get person details
- `useConfiguration()` - Get TMDB configuration
- `useImageUrls()` - Get image URL helper functions

## Image URL Helpers

```tsx
import { tmdb } from "@/lib/tmdb";

// Get poster image URL
const posterUrl = tmdb.getImageUrl(movie.poster_path, "w500");

// Get backdrop image URL
const backdropUrl = tmdb.getBackdropUrl(movie.backdrop_path, "w1280");

// Available poster sizes: "w92", "w154", "w185", "w342", "w500", "w780", "original"
// Available backdrop sizes: "w300", "w780", "w1280", "original"
```

## Cache Configuration

The module uses optimized cache times based on data freshness:

- **Movie/TV Details**: 30 minutes (details don't change often)
- **Popular Lists**: 15 minutes (updated regularly)
- **Search Results**: 5 minutes (fresh results preferred)
- **Genres**: 24 hours (rarely change)
- **Configuration**: 24 hours (very stable)

## Error Handling

The client includes comprehensive error handling:

- Automatic retries for network errors (up to 3 times with exponential backoff)
- No retries for 4xx client errors (except 408, 429)
- Detailed error messages and status codes
- Development logging for debugging
- Uses native fetch API for lightweight, dependency-free HTTP requests

## TypeScript Support

All TMDB API responses are fully typed. Import types as needed:

```tsx
import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBPerson,
  TMDBMovieFilters,
  TMDBSearchResponse,
} from "@/lib/tmdb";
```

## Development Tools

React Query DevTools are automatically included in development mode for debugging queries and cache state.

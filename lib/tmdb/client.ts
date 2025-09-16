import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBPerson,
  TMDBSearchResponse,
  TMDBDiscoverResponse,
  TMDBGenre,
  TMDBMovieFilters,
  TMDBTVFilters,
  TMDBMediaType,
  TMDBTimeWindow,
  TMDBImageSize,
  TMDBBackdropSize,
  TMDBConfiguration,
} from "./types";
import type { TMDBAPIError } from "@/lib/types/tmdb/errors";

class TMDBClient {
  private readonly baseURL = "https://api.themoviedb.org/3";
  private readonly imageBaseURL = "https://image.tmdb.org/t/p";

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    };
  }

  private async handleError(response: Response): Promise<TMDBAPIError> {
    const tmdbError: TMDBAPIError = new Error("TMDB API Error");

    try {
      const errorData = await response.json();
      tmdbError.message =
        errorData.status_message || `HTTP ${response.status}: ${response.statusText}`;
      tmdbError.status = response.status;
      tmdbError.response = errorData;
    } catch {
      tmdbError.message = `HTTP ${response.status}: ${response.statusText}`;
      tmdbError.status = response.status;
    }

    if (process.env.NODE_ENV === "development") {
      console.error("TMDB API Error:", tmdbError);
    }

    return tmdbError;
  }

  private async fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return response.json();
  }
  // Helper method to build query parameters
  private buildParams(
    params: Record<string, unknown> | TMDBMovieFilters | TMDBTVFilters
  ): Record<string, string> {
    const cleanParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    });

    return cleanParams;
  }

  // Image URL helpers
  getImageUrl(path: string | null, size: TMDBImageSize = "w500"): string | null {
    if (!path) return null;
    return `${this.imageBaseURL}/${size}${path}`;
  }

  getBackdropUrl(path: string | null, size: TMDBBackdropSize = "w780"): string | null {
    return path ? `${this.imageBaseURL}/${size}${path}` : null;
  }
  // Search endpoints
  async searchMulti(
    query: string,
    page: number = 1
  ): Promise<TMDBSearchResponse<TMDBMovie | TMDBTVShow | TMDBPerson>> {
    return this.fetchAPI("/search/multi", this.buildParams({ query, page }));
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchAPI("/search/movie", this.buildParams({ query, page }));
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchAPI("/search/tv", this.buildParams({ query, page }));
  }

  async searchPeople(query: string, page: number = 1): Promise<TMDBSearchResponse<TMDBPerson>> {
    return this.fetchAPI("/search/person", this.buildParams({ query, page }));
  }
  // Movie endpoints
  async getMovie(id: number): Promise<TMDBMovie> {
    return this.fetchAPI(`/movie/${id}`);
  }

  async getPopularMovies(page: number = 1): Promise<TMDBDiscoverResponse<TMDBMovie>> {
    return this.fetchAPI("/movie/popular", this.buildParams({ page }));
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBDiscoverResponse<TMDBMovie>> {
    return this.fetchAPI("/movie/top_rated", this.buildParams({ page }));
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBDiscoverResponse<TMDBMovie>> {
    return this.fetchAPI("/movie/upcoming", this.buildParams({ page }));
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBDiscoverResponse<TMDBMovie>> {
    return this.fetchAPI("/movie/now_playing", this.buildParams({ page }));
  }

  async discoverMovies(filters: TMDBMovieFilters = {}): Promise<TMDBDiscoverResponse<TMDBMovie>> {
    return this.fetchAPI("/discover/movie", this.buildParams(filters));
  }
  // TV Show endpoints
  async getTVShow(id: number): Promise<TMDBTVShow> {
    return this.fetchAPI(`/tv/${id}`);
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBDiscoverResponse<TMDBTVShow>> {
    return this.fetchAPI("/tv/popular", this.buildParams({ page }));
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBDiscoverResponse<TMDBTVShow>> {
    return this.fetchAPI("/tv/top_rated", this.buildParams({ page }));
  }

  async getOnTheAirTVShows(page: number = 1): Promise<TMDBDiscoverResponse<TMDBTVShow>> {
    return this.fetchAPI("/tv/on_the_air", this.buildParams({ page }));
  }

  async getAiringTodayTVShows(page: number = 1): Promise<TMDBDiscoverResponse<TMDBTVShow>> {
    return this.fetchAPI("/tv/airing_today", this.buildParams({ page }));
  }

  async discoverTVShows(filters: TMDBTVFilters = {}): Promise<TMDBDiscoverResponse<TMDBTVShow>> {
    return this.fetchAPI("/discover/tv", this.buildParams(filters));
  }
  // Trending endpoints
  async getTrending(
    mediaType: TMDBMediaType = "all",
    timeWindow: TMDBTimeWindow = "week"
  ): Promise<TMDBSearchResponse<TMDBMovie | TMDBTVShow | TMDBPerson>> {
    return this.fetchAPI(`/trending/${mediaType}/${timeWindow}`);
  }

  // Genre endpoints
  async getMovieGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetchAPI("/genre/movie/list");
  }

  async getTVGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetchAPI("/genre/tv/list");
  }

  // Person endpoints
  async getPerson(id: number): Promise<TMDBPerson> {
    return this.fetchAPI(`/person/${id}`);
  }

  // Configuration endpoint
  async getConfiguration(): Promise<TMDBConfiguration> {
    return this.fetchAPI("/configuration");
  }
}

// Create and export a singleton instance
export const tmdbClient = new TMDBClient();
export default tmdbClient;

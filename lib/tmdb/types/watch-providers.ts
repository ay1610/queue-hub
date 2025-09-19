/**
 * TMDB Watch Provider Logo object
 */
export interface WatchProviderLogo {
  /**
   * Full size logo path
   * @example "/9A1JSVmSxsyaBK4SUFsYVqbAYfW.jpg"
   */
  logo_path: string;

  /**
   * Provider ID in TMDB
   */
  provider_id: number;

  /**
   * Display name of the provider
   * @example "Netflix"
   */
  provider_name: string;

  /**
   * Priority for display order
   */
  display_priority: number;
}

/**
 * Watch Provider options by type (flatrate/streaming, rent, buy)
 */
export interface WatchProviderOptions {
  /**
   * Streaming providers (subscription-based)
   */
  flatrate?: WatchProviderLogo[];

  /**
   * Rental providers
   */
  rent?: WatchProviderLogo[];

  /**
   * Purchase providers
   */
  buy?: WatchProviderLogo[];

  /**
   * Link to view all provider options on TMDB
   */
  link: string;
}

/**
 * Response from TMDB Watch Providers API
 */
export interface WatchProvidersResponse {
  /**
   * ID of the movie/TV show
   */
  id: number;

  /**
   * Watch providers by country/region
   * Keys are ISO 3166-1 country codes
   * @example { "US": { flatrate: [...], rent: [...], buy: [...] } }
   */
  results: Record<string, WatchProviderOptions>;
}

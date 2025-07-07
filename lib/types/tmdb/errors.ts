/**
 * Standard error response from TMDB API
 */
export interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}

/**
 * Enhanced error type for TMDB API errors
 */
export interface TMDBAPIError extends Error {
  status?: number;
  code?: string;
  response?: TMDBError;
}

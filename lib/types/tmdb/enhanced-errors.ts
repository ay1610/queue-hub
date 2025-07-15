/**
 * Enhanced error types for TMDB API operations
 * Provides domain-specific context and error recovery strategies
 */

/**
 * Base class for all TMDB-related errors
 */
export class TMDBError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error specific to TV show operations
 */
export class TMDBTVError extends TMDBError {
  constructor(message: string, context?: Record<string, unknown>, originalError?: Error) {
    super(message, "TMDB_TV_ERROR", context, originalError);
  }
}

/**
 * Error specific to movie operations
 */
export class TMDBMovieError extends TMDBError {
  constructor(message: string, context?: Record<string, unknown>, originalError?: Error) {
    super(message, "TMDB_MOVIE_ERROR", context, originalError);
  }
}

/**
 * Error for invalid input parameters
 */
export class TMDBValidationError extends TMDBError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "TMDB_VALIDATION_ERROR", context);
  }
}

/**
 * Error for API rate limiting
 */
export class TMDBRateLimitError extends TMDBError {
  public readonly retryAfter?: number;

  constructor(
    message: string,
    retryAfter?: number,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, "TMDB_RATE_LIMIT_ERROR", context, originalError);
    this.retryAfter = retryAfter;
  }
}

/**
 * Error for resource not found (404)
 */
export class TMDBNotFoundError extends TMDBError {
  constructor(message: string, context?: Record<string, unknown>, originalError?: Error) {
    super(message, "TMDB_NOT_FOUND_ERROR", context, originalError);
  }
}

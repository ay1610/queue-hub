/**
 * Error handling utilities for TMDB API operations
 * Provides consistent error processing and context enrichment
 */

import {
  TMDBTVError,
  TMDBMovieError,
  TMDBValidationError,
  TMDBRateLimitError,
  TMDBNotFoundError,
} from "@/lib/types/tmdb";

/**
 * Validates TV show ID parameter
 * @param id - The TV show ID to validate
 * @throws {TMDBValidationError} When ID is invalid
 */
export function validateTVShowId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new TMDBValidationError(`Invalid TV show ID: ${id}. Must be a positive integer.`, {
      providedId: id,
      expectedType: "positive integer",
      function: "validateTVShowId",
    });
  }
}

/**
 * Validates movie ID parameter
 * @param id - The movie ID to validate
 * @throws {TMDBValidationError} When ID is invalid
 */
export function validateMovieId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new TMDBValidationError(`Invalid movie ID: ${id}. Must be a positive integer.`, {
      providedId: id,
      expectedType: "positive integer",
      function: "validateMovieId",
    });
  }
}

/**
 * Validates page number parameter
 * @param page - The page number to validate
 * @throws {TMDBValidationError} When page is invalid
 */
export function validatePageNumber(page: number): void {
  if (!Number.isInteger(page) || page <= 0) {
    throw new TMDBValidationError(`Invalid page number: ${page}. Must be a positive integer.`, {
      providedPage: page,
      expectedType: "positive integer",
      function: "validatePageNumber",
    });
  }
}

/**
 * Enhanced error wrapper for TV show operations
 * @param operation - Description of the operation being performed
 * @param context - Additional context for debugging
 * @param fn - The async function to execute
 */
export async function withTVErrorHandling<T>(
  operation: string,
  context: Record<string, unknown>,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error instanceof TMDBValidationError || error instanceof TMDBTVError) {
      throw error;
    }

    // Handle specific HTTP status codes
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;
      const originalError = error instanceof Error ? error : new Error(String(error));

      if (status === 404) {
        throw new TMDBNotFoundError(
          `TV show not found during ${operation}`,
          { ...context, httpStatus: status },
          originalError
        );
      }

      if (status === 429) {
        throw new TMDBRateLimitError(
          `Rate limit exceeded during ${operation}`,
          undefined,
          { ...context, httpStatus: status },
          originalError
        );
      }
    }

    // Wrap generic errors with TV-specific context
    throw new TMDBTVError(
      `Failed to ${operation}`,
      {
        ...context,
        originalMessage: error instanceof Error ? error.message : String(error),
      },
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Enhanced error wrapper for movie operations
 * @param operation - Description of the operation being performed
 * @param context - Additional context for debugging
 * @param fn - The async function to execute
 */
export async function withMovieErrorHandling<T>(
  operation: string,
  context: Record<string, unknown>,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error instanceof TMDBValidationError || error instanceof TMDBMovieError) {
      throw error;
    }

    // Handle specific HTTP status codes
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;
      const originalError = error instanceof Error ? error : new Error(String(error));

      if (status === 404) {
        throw new TMDBNotFoundError(
          `Movie not found during ${operation}`,
          { ...context, httpStatus: status },
          originalError
        );
      }

      if (status === 429) {
        throw new TMDBRateLimitError(
          `Rate limit exceeded during ${operation}`,
          undefined,
          { ...context, httpStatus: status },
          originalError
        );
      }
    }

    // Wrap generic errors with movie-specific context
    throw new TMDBMovieError(
      `Failed to ${operation}`,
      {
        ...context,
        originalMessage: error instanceof Error ? error.message : String(error),
      },
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

import { RuntimeAPIResponse, RuntimeAPIErrorResponse } from "../types";

/**
 * Custom error class for runtime data API errors
 */
export class RuntimeDataApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public timestamp: string
  ) {
    super(message);
    this.name = "RuntimeDataApiError";
  }
}

/**
 * Fetches runtime data from our API using IMDB ID.
 *
 * @param imdbId - The IMDB ID (e.g., "tt1375666") to fetch runtime data for.
 * @returns Promise containing runtime data response.
 * @throws RuntimeDataApiError if the request fails or IMDB ID is invalid.
 */
export async function getRuntimeData(imdbId: string): Promise<RuntimeAPIResponse> {
  if (!imdbId) {
    throw new RuntimeDataApiError(
      "Invalid IMDB ID provided to getRuntimeData function.",
      "INVALID_IMDB_ID",
      400,
      new Date().toISOString()
    );
  }

  const response = await fetch(`/api/run-time?imdbId=${encodeURIComponent(imdbId)}`);

  if (!response.ok) {
    try {
      const errorData: RuntimeAPIErrorResponse = await response.json();
      throw new RuntimeDataApiError(
        errorData.error,
        errorData.code,
        response.status,
        errorData.timestamp
      );
    } catch {
      // Fallback for non-JSON error responses
      throw new RuntimeDataApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        "UNKNOWN_ERROR",
        response.status,
        new Date().toISOString()
      );
    }
  }

  return response.json();
}

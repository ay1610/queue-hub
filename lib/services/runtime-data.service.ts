import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Domain types
export interface RuntimeDataResult {
  tconst: string;
  title_type: string | null;
  primary_title: string | null;
  runtime_minutes: number | null;
}

// Service errors
export class RuntimeDataNotFoundError extends Error {
  constructor(imdbId: string) {
    super(`No runtime data found for IMDB ID: ${imdbId}`);
    this.name = "RuntimeDataNotFoundError";
  }
}

export class InvalidImdbIdError extends Error {
  constructor(imdbId: string) {
    super(`Invalid IMDB ID format: ${imdbId}`);
    this.name = "InvalidImdbIdError";
  }
}

// Validation schema
const ImdbIdSchema = z
  .string()
  .regex(/^tt\d+$/, "Invalid IMDB ID format. Must start with 'tt' followed by digits.");

/**
 * Service class for runtime data operations
 * Follows Single Responsibility Principle and provides clean separation of concerns
 */
export class RuntimeDataService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Validates IMDB ID format
   * @param imdbId - Raw IMDB ID string
   * @returns Validated IMDB ID
   * @throws InvalidImdbIdError if format is invalid
   */
  private validateImdbId(imdbId: string): string {
    const result = ImdbIdSchema.safeParse(imdbId);
    if (!result.success) {
      throw new InvalidImdbIdError(imdbId);
    }
    return result.data;
  }

  /**
   * Retrieves runtime data for a given IMDB ID
   * @param rawImdbId - IMDB ID to search for
   * @returns Runtime data if found
   * @throws InvalidImdbIdError if IMDB ID format is invalid
   * @throws RuntimeDataNotFoundError if no data found
   */
  async getRuntimeData(rawImdbId: string): Promise<RuntimeDataResult> {
    const imdbId = this.validateImdbId(rawImdbId);

    const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true";
    if (USE_MOCK_DATA) {
      if (imdbId === "tt1234567") {
        return {
          tconst: imdbId,
          title_type: "movie",
          primary_title: "Mock Movie Title",
          runtime_minutes: 120,
        };
      } else {
        return {
          tconst: imdbId,
          title_type: null,
          primary_title: null,
          runtime_minutes: null,
          message: "No runtime found (mock)",
        } as RuntimeDataResult & { message: string };
      }
    }

    if (!this.prisma) {
      throw new Error(
        "Prisma client is not available. Check DEV_USE_MOCK and database connection."
      );
    }
    const runtimeData = await this.prisma.runtime_data.findUnique({
      where: {
        tconst: imdbId,
      },
    });

    if (!runtimeData) {
      return {
        tconst: imdbId,
        title_type: null,
        primary_title: null,
        runtime_minutes: null,
        message: "No runtime found",
      } as RuntimeDataResult & { message: string };
    }

    return runtimeData;
  }
}

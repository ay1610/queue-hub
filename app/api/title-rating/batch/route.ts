import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true";

interface ApiBatchSuccessResponse<T> {
  data: T[];
  timestamp: string;
}

interface TitleRatingResult {
  tconst: string;
  averageRating: number | null;
  numVotes: number | null;
}

const mockRatings: TitleRatingResult[] = [
  { tconst: "tt1234567", averageRating: 8.5, numVotes: 12345 },
  { tconst: "tt7654321", averageRating: 7.2, numVotes: 5432 },
];

export async function POST(request: NextRequest) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized access. Please authenticate.",
          code: "AUTH_REQUIRED",
          timestamp,
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const imdbIds = Array.isArray(body.imdbIds) ? body.imdbIds : [];
    if (!imdbIds.length || !imdbIds.every((id: string) => typeof id === "string")) {
      return NextResponse.json(
        {
          error: "imdbIds must be a non-empty array of strings",
          code: "INVALID_IMDB_IDS",
          timestamp,
        },
        { status: 400 }
      );
    }

    if (USE_MOCK_DATA) {
      const results: TitleRatingResult[] = imdbIds.map((id: string) => {
        const found = mockRatings.find((r) => r.tconst === id);
        return found || { tconst: id, averageRating: null, numVotes: null };
      });
      return NextResponse.json<ApiBatchSuccessResponse<TitleRatingResult>>(
        { data: results, timestamp },
        { status: 200 }
      );
    }

    // Fetch ratings for each ID in parallel, preserving order
    const results: TitleRatingResult[] = await Promise.all(
      imdbIds.map(async (id: string) => {
        try {
          if (!prisma) {
            throw new Error(
              "Prisma client is not available. Check DEV_USE_MOCK and database connection."
            );
          }
          const rating = await prisma.title_ratings.findUnique({ where: { tconst: id } });
          if (!rating) {
            return { tconst: id, averageRating: null, numVotes: null };
          }
          return {
            tconst: id,
            averageRating: rating.average_rating ?? null,
            numVotes: rating.num_votes ?? null,
          };
        } catch {
          return { tconst: id, averageRating: null, numVotes: null };
        }
      })
    );

    const durationMs = Date.now() - start;
    console.log(
      `[BATCH_TITLE_RATING] Processed ${imdbIds.length} ids in ${durationMs}ms at ${timestamp}`
    );

    return NextResponse.json<ApiBatchSuccessResponse<TitleRatingResult>>(
      {
        data: results,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Batch Title Rating API Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp,
    });
    return NextResponse.json(
      {
        error: "Internal server error occurred while fetching batch title ratings",
        code: "INTERNAL_ERROR",
        timestamp,
      },
      { status: 500 }
    );
  }
}

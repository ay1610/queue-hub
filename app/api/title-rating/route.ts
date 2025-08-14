import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true";

interface ApiErrorResponse {
  error: string;
  code: string;
  timestamp: string;
}

interface ApiSuccessResponse<T> {
  data: T;
  timestamp: string;
}

const mockRating = {
  tconst: "tt1234567",
  averageRating: 8.5,
  numVotes: 12345,
};

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: "Unauthorized access. Please authenticate.",
          code: "AUTH_REQUIRED",
          timestamp,
        },
        { status: 401 }
      );
    }

    // Extract IMDB ID
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get("imdbId");

    if (!imdbId) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: "IMDB ID parameter is required",
          code: "MISSING_IMDB_ID",
          timestamp,
        },
        { status: 400 }
      );
    }

    if (USE_MOCK_DATA) {
      if (imdbId === mockRating.tconst) {
        return NextResponse.json<ApiSuccessResponse<typeof mockRating>>(
          { data: mockRating, timestamp },
          { status: 200 }
        );
      } else {
        return NextResponse.json<ApiErrorResponse>(
          {
            error: `No rating found for IMDB ID: ${imdbId}`,
            code: "RATING_NOT_FOUND",
            timestamp,
          },
          { status: 404 }
        );
      }
    }

    // Query the title_ratings table
    if (!prisma) {
      throw new Error(
        "Prisma client is not available. Check DEV_USE_MOCK and database connection."
      );
    }
    const rating = await prisma.title_ratings.findUnique({
      where: { tconst: imdbId },
    });

    if (!rating) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: `No rating found for IMDB ID: ${imdbId}`,
          code: "RATING_NOT_FOUND",
          timestamp,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccessResponse<typeof rating>>(
      {
        data: rating,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Title Rating API Error:", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        error: "Internal server error occurred while fetching rating data",
        code: "INTERNAL_ERROR",
        timestamp,
      },
      { status: 500 }
    );
  }
}

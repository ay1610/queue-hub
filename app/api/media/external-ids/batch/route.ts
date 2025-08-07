import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTVShowExternalIds } from "@/lib/tmdb/tv/client";
import { getMovieExternalIds } from "@/lib/tmdb/movie/client";

// Accepts mediaType: 'tv' | 'movie' and tmdbIds: number[]
interface ApiBatchSuccessResponse<T> {
  data: T[];
  timestamp: string;
}

export async function POST(request: NextRequest) {
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
    const tmdbIds = Array.isArray(body.tmdbIds) ? body.tmdbIds : [];
    const mediaType = body.mediaType;
    if (
      !tmdbIds.length ||
      !tmdbIds.every((id: number) => typeof id === "number") ||
      !["tv", "movie"].includes(mediaType)
    ) {
      return NextResponse.json(
        {
          error:
            "tmdbIds must be a non-empty array of numbers and mediaType must be 'tv' or 'movie'",
          code: "INVALID_INPUT",
          timestamp,
        },
        { status: 400 }
      );
    }

    // Fetch external IDs for each TMDB ID in parallel
    const results = await Promise.all(
      tmdbIds.map(async (id: number) => {
        try {
          if (mediaType === "tv") {
            return await getTVShowExternalIds(id);
          } else {
            return await getMovieExternalIds(id);
          }
        } catch {
          return null;
        }
      })
    );
    return NextResponse.json<ApiBatchSuccessResponse<unknown>>( // Use 'unknown' for type safety if the exact type is not known
      {
        data: results,
        timestamp,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Internal server error occurred while fetching batch external ids",
        code: "INTERNAL_ERROR",
        timestamp,
      },
      { status: 500 }
    );
  }
}

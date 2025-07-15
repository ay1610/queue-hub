import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import {
  RuntimeDataService,
  RuntimeDataNotFoundError,
  InvalidImdbIdError,
  type RuntimeDataResult,
} from "@/lib/services/runtime-data.service";

// Standardized API response types
interface ApiErrorResponse {
  error: string;
  code: string;
  timestamp: string;
}

interface ApiSuccessResponse<T> {
  data: T;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  const runtimeService = new RuntimeDataService(prisma);

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
    const rawImdbId = searchParams.get("imdbId");

    if (!rawImdbId) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: "IMDB ID parameter is required",
          code: "MISSING_IMDB_ID",
          timestamp,
        },
        { status: 400 }
      );
    }

    // Use service to get runtime data (handles validation and business logic)
    const runtimeData = await runtimeService.getRuntimeData(rawImdbId);

    return NextResponse.json<ApiSuccessResponse<RuntimeDataResult>>(
      {
        data: runtimeData,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle domain-specific errors
    if (error instanceof InvalidImdbIdError) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: error.message,
          code: "INVALID_IMDB_FORMAT",
          timestamp,
        },
        { status: 400 }
      );
    }

    if (error instanceof RuntimeDataNotFoundError) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: error.message,
          code: "RUNTIME_NOT_FOUND",
          timestamp,
        },
        { status: 404 }
      );
    }

    // Structured error logging for unexpected errors
    console.error("Runtime API Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp,
      url: request.url,
      method: request.method,
    });

    return NextResponse.json<ApiErrorResponse>(
      {
        error: "Internal server error occurred while fetching runtime data",
        code: "INTERNAL_ERROR",
        timestamp,
      },
      { status: 500 }
    );
  }
}

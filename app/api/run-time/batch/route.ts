import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { RuntimeDataService, type RuntimeDataResult } from "@/lib/services/runtime-data.service";

interface ApiBatchSuccessResponse<T> {
  data: T[];
  timestamp: string;
}

export async function POST(request: NextRequest) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const runtimeService = new RuntimeDataService(prisma);

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

    // Fetch runtime data for each ID in parallel, preserving order
    const results: RuntimeDataResult[] = await Promise.all(
      imdbIds.map(async (id: string) => {
        try {
          return await runtimeService.getRuntimeData(id);
        } catch {
          return {
            tconst: id,
            title_type: null,
            primary_title: null,
            runtime_minutes: null,
          };
        }
      })
    );

    const durationMs = Date.now() - start;
    console.log(
      `[BATCH_RUNTIME] Processed ${imdbIds.length} ids in ${durationMs}ms at ${timestamp}`
    );

    return NextResponse.json<ApiBatchSuccessResponse<RuntimeDataResult>>(
      {
        data: results,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Batch Runtime API Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp,
    });
    return NextResponse.json(
      {
        error: "Internal server error occurred while fetching batch runtime data",
        code: "INTERNAL_ERROR",
        timestamp,
      },
      { status: 500 }
    );
  }
}

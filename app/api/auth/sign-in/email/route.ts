import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
    "http://localhost:3000",
  ];
  const isAllowedOrigin = allowedOrigins.includes(origin);

  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  return handler.POST(req);
};

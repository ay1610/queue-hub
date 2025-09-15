import { NextRequest, NextResponse } from "next/server";

// Use environment variable for allowed origins, fallback to localhost
const allowedOrigins = [
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
  "http://localhost:3000",
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const isPreflight = request.method === "OPTIONS";

  // Debug logs
  console.log("allowedOrigins", allowedOrigins);
  console.log("[CORS] Request origin:", origin);
  console.log("[CORS] Allowed origins:", allowedOrigins);
  console.log("[CORS] isAllowedOrigin:", isAllowedOrigin);
  console.log("[CORS] Request method:", request.method);

  if (isPreflight) {
    console.log("[CORS] Handling preflight request");
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    console.log("[CORS] Preflight headers:", preflightHeaders);
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const response = NextResponse.next();
  if (isAllowedOrigin) {
    console.log("[CORS] Setting Access-Control-Allow-Origin header for:", origin);
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  matcher: "/api/:path*",
};

import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

// Explicitly list allowed origins and allow any Vercel preview domain
const allowedOrigins = ["http://localhost:3000", "https://queue-hub-tau.vercel.app"];
const isVercelPreview = (origin: string): boolean =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin) || isVercelPreview(origin);
  const isPreflight = request.method === "OPTIONS";

  // Handle CORS preflight requests
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
      }),
      ...corsOptions,
    };
    return NextResponse.json({}, { status: 200, headers: preflightHeaders });
  }

  const response = NextResponse.next();

  // Handle CORS for regular requests
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");

  // Detect and set user region after sign in
  if (request.nextUrl.pathname === "/api/auth/sign-in/email") {
    const { city, country, region } = geolocation(request);
    // Set region information in cookies
    response.cookies.set(
      "user-region",
      JSON.stringify({
        city,
        country,
        region,
        iso_3166_1: country || "US", // Default to US if no country code
      }),
      {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      }
    );
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};

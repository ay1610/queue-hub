import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

function isSignUpRequest(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname || "";
    return pathname.includes("/api/auth/sign-up") || pathname.includes("/api/auth/signup");
  } catch {
    return false;
  }
}

export const POST = async (req: Request) => {
  // Defense-in-depth: block sign-up attempts at the API level in production.
  if (process.env.NODE_ENV === "production" && isSignUpRequest(req)) {
    return NextResponse.json({ error: "Sign-ups are disabled in production." }, { status: 403 });
  }

  return handler.POST(req);
};

export const GET = async (req: Request) => {
  return handler.GET(req);
};

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://192.168.4.200",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  const response = await handler.POST(req);
  const data = await response.json();
  return NextResponse.json(data, {
    status: response.status,
    headers: {
      "Access-Control-Allow-Origin": "http://192.168.4.200",
    },
  });
};

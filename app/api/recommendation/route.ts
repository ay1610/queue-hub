import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/recommendation
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recs = await prisma.recommendation.findMany({
    where: { toUserId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch user info for each recommendation
  const recommendations = await Promise.all(
    recs.map(async (rec) => {
      const user = await prisma.user.findUnique({
        where: { id: rec.fromUserId },
        select: { name: true, image: true },
      });
      return {
        ...rec,
        fromUsername: user?.name ?? "Unknown User",
        fromUserImage: user?.image ?? null,
      };
    })
  );
  return NextResponse.json({ recommendations });
}

// POST /api/recommendation
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toUserId, mediaId, mediaType, message } = await req.json();
  if (!toUserId || !mediaId || !mediaType || typeof message !== "string") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (toUserId === session.user.id) {
    return NextResponse.json({ error: "Cannot recommend to yourself" }, { status: 400 });
  }

  // Prevent duplicate
  const exists = await prisma.recommendation.findUnique({
    where: {
      fromUserId_toUserId_mediaId_mediaType: {
        fromUserId: session.user.id,
        toUserId,
        mediaId,
        mediaType,
      },
    },
  });
  if (exists) {
    return NextResponse.json({ error: "Already recommended" }, { status: 409 });
  }

  // Create recommendation
  const rec = await prisma.recommendation.create({
    data: {
      fromUserId: session.user.id,
      toUserId,
      mediaId,
      mediaType,
      message,
    },
  });
  return NextResponse.json({ success: true, recommendation: rec });
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true";

type MockRecommendation = {
  id: number;
  fromUserId: string;
  toUserId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  message: string;
  createdAt: Date;
  fromUsername: string;
  fromUserImage: string | null;
};

const mockRecommendations: MockRecommendation[] = [
  {
    id: 1,
    fromUserId: "mock-user-2",
    toUserId: "mock-user-id",
    mediaId: 101,
    mediaType: "movie",
    message: "You should watch this!",
    createdAt: new Date(),
    fromUsername: "Mock User 2",
    fromUserImage: null,
  },
];

// GET /api/recommendation
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (USE_MOCK_DATA) {
    const recommendations = mockRecommendations.filter((r) => r.toUserId === session.user.id);
    return NextResponse.json({ recommendations });
  }
  if (!prisma) {
    throw new Error("Prisma client is not available. Check DEV_USE_MOCK and database connection.");
  }
  const recs = await prisma.recommendation.findMany({
    where: { toUserId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  // Fetch user info for each recommendation
  const recommendations = await Promise.all(
    recs.map(async (rec) => {
      if (!prisma) {
        throw new Error(
          "Prisma client is not available. Check DEV_USE_MOCK and database connection."
        );
      }
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
  if (USE_MOCK_DATA) {
    const exists = mockRecommendations.find(
      (r) =>
        r.fromUserId === session.user.id &&
        r.toUserId === toUserId &&
        r.mediaId === mediaId &&
        r.mediaType === mediaType
    );
    if (exists) {
      return NextResponse.json({ error: "Already recommended" }, { status: 409 });
    }
    const newRec: MockRecommendation = {
      id: Math.floor(Math.random() * 10000),
      fromUserId: session.user.id,
      toUserId,
      mediaId,
      mediaType,
      message,
      createdAt: new Date(),
      fromUsername: "Mock User", // Could be improved if you want to mock user lookup
      fromUserImage: null,
    };
    mockRecommendations.push(newRec);
    return NextResponse.json({ success: true, recommendation: newRec });
  }
  // Prevent duplicate
  if (!prisma) {
    throw new Error("Prisma client is not available. Check DEV_USE_MOCK and database connection.");
  }
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
  if (!prisma) {
    throw new Error("Prisma client is not available. Check DEV_USE_MOCK and database connection.");
  }
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

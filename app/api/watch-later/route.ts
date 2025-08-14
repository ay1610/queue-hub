import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true";

type MockWatchLaterItem = {
  id: number;
  userId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  addedAt: Date;
};

const mockWatchLaterItems: MockWatchLaterItem[] = [
  {
    id: 1,
    userId: "mock-user-id",
    mediaId: 101,
    mediaType: "movie",
    addedAt: new Date(),
  },
  {
    id: 2,
    userId: "mock-user-id",
    mediaId: 202,
    mediaType: "tv",
    addedAt: new Date(),
  },
];

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    if (USE_MOCK_DATA) {
      const items = mockWatchLaterItems.filter((i) => i.userId === userId);
      return NextResponse.json({ success: true, data: items, count: items.length });
    }
    if (!prisma) {
      throw new Error(
        "Prisma client is not available. Check DEV_USE_MOCK and database connection."
      );
    }
    const watchLaterItems = await prisma.watchLater.findMany({
      where: { userId: userId },
      orderBy: { addedAt: "desc" },
    });
    return NextResponse.json({
      success: true,
      data: watchLaterItems,
      count: watchLaterItems.length,
    });
  } catch (error) {
    console.error("Error fetching watch-later list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await request.json();
    const { mediaId, mediaType } = body;
    if (!mediaId || !mediaType) {
      return NextResponse.json({ error: "mediaId and mediaType are required" }, { status: 400 });
    }
    if (!["movie", "tv"].includes(mediaType)) {
      return NextResponse.json({ error: "mediaType must be 'movie' or 'tv'" }, { status: 400 });
    }
    if (USE_MOCK_DATA) {
      const newItem = {
        id: Math.floor(Math.random() * 10000),
        userId,
        mediaId: parseInt(mediaId),
        mediaType,
        addedAt: new Date(),
      };
      mockWatchLaterItems.push(newItem);
      return NextResponse.json({ success: true, data: newItem });
    }
    if (!prisma) {
      throw new Error(
        "Prisma client is not available. Check DEV_USE_MOCK and database connection."
      );
    }
    const watchLaterItem = await prisma.watchLater.upsert({
      where: {
        userId_mediaId_mediaType: {
          userId,
          mediaId: parseInt(mediaId),
          mediaType,
        },
      },
      update: { addedAt: new Date() },
      create: { userId, mediaId: parseInt(mediaId), mediaType, addedAt: new Date() },
    });
    return NextResponse.json({ success: true, data: watchLaterItem });
  } catch (error) {
    console.error("Error fetching watch-later list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await request.json();
    const { mediaId, mediaType } = body;
    if (!mediaId || !mediaType) {
      return NextResponse.json(
        { error: "mediaId and mediaType are required in the request body" },
        { status: 400 }
      );
    }
    if (USE_MOCK_DATA) {
      const idx = mockWatchLaterItems.findIndex(
        (i) => i.userId === userId && i.mediaId === parseInt(mediaId) && i.mediaType === mediaType
      );
      if (idx === -1) {
        return NextResponse.json({ error: "Item not found in watch-later list" }, { status: 404 });
      }
      mockWatchLaterItems.splice(idx, 1);
      return NextResponse.json({ success: true, message: "Item removed from watch-later list" });
    }
    if (!prisma) {
      throw new Error(
        "Prisma client is not available. Check DEV_USE_MOCK and database connection."
      );
    }
    const deletedItem = await prisma.watchLater.deleteMany({
      where: { userId, mediaId: parseInt(mediaId), mediaType },
    });
    if (deletedItem.count === 0) {
      return NextResponse.json({ error: "Item not found in watch-later list" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Item removed from watch-later list" });
  } catch (error) {
    console.error("Error removing from watch-later list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

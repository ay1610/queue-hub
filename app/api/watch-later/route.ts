import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const watchLaterItems = await prisma.watchLater.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        addedAt: "desc",
      },
    });
    console.log("watchlater items", watchLaterItems.length);
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

    const watchLaterItem = await prisma.watchLater.upsert({
      where: {
        userId_mediaId_mediaType: {
          userId,
          mediaId: parseInt(mediaId),
          mediaType,
        },
      },
      update: {
        addedAt: new Date(),
      },
      create: {
        userId,
        mediaId: parseInt(mediaId),
        mediaType,
        addedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: watchLaterItem,
    });
  } catch (error) {
    console.error("Error fetching watch-later list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/watch-later
 * Removes a media item from the watch-later list
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { mediaId, mediaType } = body;
    // Validate input
    if (!mediaId || !mediaType) {
      return NextResponse.json(
        { error: "mediaId and mediaType are required in the request body" },
        { status: 400 }
      );
    }

    // Remove from watch-later list
    const deletedItem = await prisma.watchLater.deleteMany({
      where: {
        userId,
        mediaId: parseInt(mediaId),
        mediaType,
      },
    });

    if (deletedItem.count === 0) {
      return NextResponse.json({ error: "Item not found in watch-later list" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from watch-later list",
    });
  } catch (error) {
    console.error("Error removing from watch-later list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

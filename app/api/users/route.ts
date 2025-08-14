import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const USE_MOCK_DATA = process.env.DEV_USE_MOCK === "true";

const mockUsers = [
  {
    id: "mock-user-2",
    name: "Mock User 2",
    email: "mock2@example.com",
    image: null,
  },
  {
    id: "mock-user-3",
    name: "Mock User 3",
    email: "mock3@example.com",
    image: null,
  },
];

// GET /api/users
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (USE_MOCK_DATA) {
    // Filter out the current user if present in mock data
    const users = mockUsers.filter((u) => u.id !== session.user.id);
    return NextResponse.json({ users });
  }
  if (!prisma) {
    throw new Error("Prisma client is not available. Check DEV_USE_MOCK and database connection.");
  }
  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ users });
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/users
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

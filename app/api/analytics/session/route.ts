import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
}

export async function POST(request: Request) {
  const user = await getCurrentDbUser();
  const body = await request.json();
  const session = await prisma.analyticsSession.create({
    data: {
      userId: user?.id,
      ipAddress: clientIp(request),
      browser: body.browser || request.headers.get("user-agent") || "Unknown",
      networkProvider: body.networkProvider || "Provider lookup required",
      deviceType: body.deviceType || "unknown",
      location: body.location || null,
      pagesVisited: body.pagesVisited || [],
      totalSecondsSpent: body.totalSecondsSpent || 0,
      accessCount: body.accessCount || 1
    }
  });
  return NextResponse.json(session, { status: 201 });
}

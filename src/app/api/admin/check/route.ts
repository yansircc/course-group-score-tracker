import { Redis } from "@upstash/redis";
import { env } from "@/env";
import { NextResponse } from "next/server";

const ADMIN_KEY = "offline-course-admins";
const EXPIRY_TIME = 60 * 60 * 24 * 7; // 7 days in seconds

const redis = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ isAdmin: false });
  }

  try {
    const adminIds = (await redis.get<string[]>(ADMIN_KEY)) ?? [];
    return NextResponse.json({ isAdmin: adminIds.includes(clientId) });
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return NextResponse.json({ isAdmin: false });
  }
}

export async function POST(request: Request) {
  const { clientId } = (await request.json()) as { clientId: string };

  if (!clientId) {
    return NextResponse.json({ success: false });
  }

  try {
    const adminIds = (await redis.get<string[]>(ADMIN_KEY)) ?? [];
    if (!adminIds.includes(clientId)) {
      adminIds.push(clientId);
      await redis.set(ADMIN_KEY, adminIds);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to set admin status:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

import { Redis } from "@upstash/redis";
import { env } from "@/env";
import { NextResponse } from "next/server";

const SCORE_KEY = "offline-course-scores";
const ADMIN_KEY = "offline-course-admins";

const redis = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    // Check if the requester is an admin
    const adminIds = (await redis.get<string[]>(ADMIN_KEY)) ?? [];
    if (!adminIds.includes(clientId)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Delete all data
    await Promise.all([redis.del(SCORE_KEY), redis.del(ADMIN_KEY)]);

    return NextResponse.json({
      success: true,
      message: "All data has been reset",
    });
  } catch (error) {
    console.error("Failed to reset data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset data" },
      { status: 500 },
    );
  }
}

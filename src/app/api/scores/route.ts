import { Redis } from "@upstash/redis";
import { env } from "@/env";
import { NextResponse } from "next/server";
import type { Group } from "@/store/score-store";

const SCORE_KEY = "offline-course-scores";
const EXPIRY_TIME = 60 * 60 * 24 * 3; // 3 days in seconds

const redis = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});

export async function GET() {
  try {
    const scores = await redis.get<Group[]>(SCORE_KEY);
    return NextResponse.json(scores ?? []);
  } catch (error) {
    console.error("Failed to get scores from Redis:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const groups = (await request.json()) as Group[];
    await redis.set(SCORE_KEY, groups);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to set scores in Redis:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

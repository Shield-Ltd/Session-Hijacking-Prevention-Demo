import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { verifySession } from "anti-session-hijack";
import { hashToken } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const { fingerprint } = await request.json();
    const authToken = request.cookies.get("authToken")?.value;
    if (!authToken) {
      throw new Error("AuthToken not found")
    }
    const authTokenHash = hashToken(authToken)

    // Verify session
    const result = await verifySession(authTokenHash, fingerprint, redis);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
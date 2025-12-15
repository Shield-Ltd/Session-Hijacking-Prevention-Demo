import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "anti-session-hijack";

export async function POST(request: NextRequest) {
  try {
    const { fingerprint } = await request.json();
    const authToken = request.cookies.get("authToken")?.value;
    if (!authToken) {
      return NextResponse.json(
        { valid: false },
        { status: 401 }
      );
    }

    // Create options
    const options = {
      jwtSecret: process.env.JWT_SECRET || "your-secret-key",
      jwtExpiry: "7d"
    };

    // Verify session
    const result = await verifySession(
      { authToken },
      db,
      fingerprint,
      options
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
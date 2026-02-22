import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { verifyPassword, hashToken } from "@/lib/crypto";

import { addSession, generateAuthToken } from "anti-session-hijack";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fingerprint } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const users = await db`
      SELECT id, name, email, password_hash FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }


    // Generate JWT using npm package
    const token = await generateAuthToken(
      process.env.JWT_SECRET || "your-secret-key",
      {
        payload: {
          id: user.id,
          email: user.email,
        },
        expiresIn: "7d",
      }
    );

    // Hash token for storage
    const authTokenHash = hashToken(token);

    // Store session in Redis
    await addSession(authTokenHash, fingerprint, redis);

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
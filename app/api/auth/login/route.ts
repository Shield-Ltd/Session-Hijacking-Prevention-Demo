import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { login } from "anti-session-hijack";

export async function POST(request: NextRequest) {
  try {  
    const { email, password, fingerprint } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    // Create options
    const options = {
      jwtSecret: process.env.JWT_SECRET || "your-secret-key",
      jwtExpiry: "7d"
    };


    const result = await login(
      { email, password },
      db,
      fingerprint,
      options,
    );

    // Prepare response
    const response = NextResponse.json({
      message: "Login successful",
      user: result.user,
      token: result.token
    }, { status: 200 });

    if (!response){
      console.error("Response not found");
      return
    }

    // Set cookie
    response.cookies.set("authToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
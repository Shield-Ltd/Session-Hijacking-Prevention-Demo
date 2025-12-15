import { NextRequest, NextResponse } from "next/server";
import { signup } from "anti-session-hijack";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database connection not configured. Please check your DATABASE_URL environment variable." },
        { status: 500 }
      );
    }
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const result = await signup(
      { name, email, password },
      db,
    );

    return NextResponse.json(
      {
        message: "User created successfully",
        user: result,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
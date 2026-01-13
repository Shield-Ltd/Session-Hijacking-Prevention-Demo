import { NextRequest, NextResponse } from "next/server";
import { generateUUID, hashPassword } from '@/lib/crypto';
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

    // Check if user exists
    const existingUsers = await db`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Generate UUID for user
    const userId = generateUUID();

    // Create user
    await db`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (${userId}, ${name}, ${email}, ${passwordHash})
    `;

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
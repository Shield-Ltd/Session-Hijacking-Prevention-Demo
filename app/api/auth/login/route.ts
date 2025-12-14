import { type NextRequest, NextResponse } from "next/server"
import { createHash } from 'crypto';
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import * as jose from 'jose'

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database connection not configured. Please check your DATABASE_URL environment variable." },
        { status: 500 }
      );
    }

    const { email, password, fingerprint } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const users = await db`
      SELECT * FROM users WHERE email = ${email}
    `

    // Check if user exists
    if (users.length === 0) {
      return NextResponse.json({ error: "User does not exist" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
    
    const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36)
    // Generate JWT
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const token = await new jose.SignJWT({ 
      sub: user.id,
      userEmail: user.email,
      nonce : nonce,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secretKey)

    const userId = user.id
    const authToken_hash = hashToken(token);
    await db`
      INSERT INTO sessionkeys (authToken_hash, fingerprint, user_id)
      VALUES (${authToken_hash}, ${fingerprint}, ${userId})
    `;

    // Prepare response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    }, { status: 200 })

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
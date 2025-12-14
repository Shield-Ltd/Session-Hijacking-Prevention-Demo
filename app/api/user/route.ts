import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import * as jose from 'jose'

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database connection not configured." }, { status: 500 })
    }

    const authToken = request.cookies.get("authToken")?.value
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify JWT
    try {
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
      const { payload } = await jose.jwtVerify(authToken, secretKey)
      const userId = (payload as any).sub

      if (!userId) {
        return NextResponse.json({ error: "Invalid token payload" }, { status: 401 })
      }

      const users = await db`
        SELECT id, name, email FROM users WHERE id = ${userId}
      `

      if (users.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const user = users[0]
      return NextResponse.json({ user })
    } catch (error) {
      console.error('Token verify error:', error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createHash } from 'crypto';
import { db } from "@/lib/db"
import * as jose from 'jose'

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { valid: false, error: "Database connection not configured. Please check your DATABASE_URL environment variable." },
        { status: 500 }
      );
    }

    const authToken = request.cookies.get("authToken")?.value
    
    if (!authToken) {
      return NextResponse.json(
        { valid: false },
        { status: 401 }
      )
    }

    // Get fingerprint from request body
    const { fingerprint } = await request.json()
    
    if (!fingerprint) {
      return NextResponse.json(
        { valid: false, message: "Fingerprint is required" },
        { status: 400 }
      )
    }
    
    try {
      const authToken_hash = hashToken(authToken)

      // Check if session exists with matching fingerprint
      const sessions = await db`
        SELECT * FROM sessionkeys 
        WHERE authToken_hash = ${authToken_hash} 
          AND fingerprint = ${fingerprint}
      `

      if (sessions.length === 0) {
        return NextResponse.json(
          { 
            valid: false, 
            hijacked: true
          },
          { status: 401 }
        )
      }

      return NextResponse.json({
        valid: true,
        message: "Session verified successfully"
      })
      
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { valid: false },
            { status: 401 }
        )
    }
    
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
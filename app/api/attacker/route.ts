import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const sessions = await db`
      SELECT id, url, session_name, session_id
      FROM device_sessions
      ORDER BY created_at DESC
    `

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('attacker list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

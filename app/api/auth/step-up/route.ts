import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { createHash } from "crypto"

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

function hashFingerprint(fp: string) {
  return createHash("sha256")
    .update(fp + process.env.FP_SECRET)
    .digest("hex")
}

export async function POST(req: NextRequest) {
  try {
    const authToken = req.cookies.get("authToken")?.value
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { password, fingerprint } = await req.json()
    if (!password || !fingerprint) {
      return NextResponse.json(
        { error: "Password and fingerprint required" },
        { status: 400 }
      )
    }

    const tokenHash = hashToken(authToken)
    const fpHash = hashFingerprint(fingerprint)

    // Get user linked to this session
    const records = await db`
      SELECT users.id, users.password
      FROM sessionkeys
      JOIN users ON users.id = sessionkeys.user_id
      WHERE sessionkeys.authToken_hash = ${tokenHash}
    `

    if (records.length === 0) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 401 }
      )
    }

    const user = records[0]

    const isValid = await bcrypt.compare(password, user.password)

    // ❌ Wrong password → kill session
    if (!isValid) {
      await db`
        DELETE FROM sessionkeys
        WHERE authToken_hash = ${tokenHash}
      `

      return NextResponse.json(
        { error: "Verification failed. Session terminated." },
        { status: 401 }
      )
    }

    // ✅ Correct password → re-bind fingerprint
    await db`
      UPDATE sessionkeys
      SET fingerprint = ${fpHash}
      WHERE authToken_hash = ${tokenHash}
    `

    return NextResponse.json({
      success: true,
      message: "Device verified successfully"
    })
  } catch (err) {
    console.error("Step-up auth error:", err)
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { verifySession, email } from "anti-session-hijack";
import { hashToken } from "@/lib/crypto";
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { fingerprint } = await request.json();
    const authToken = request.cookies.get("authToken")?.value;
    if (!authToken) {
      throw new Error("AuthToken not found")
    }
    const authTokenHash = hashToken(authToken)

    const result = await verifySession(authTokenHash, fingerprint, redis);
    if (result.hijacked){
      try {
        const userEmail = getEmailFromAuthToken(request);
        if (!userEmail) {
            throw new Error('Email not found in authToken');
        }
        await email("gmail", process.env.EMAIL_ID as string, process.env.EMAIL_APP_PASSWORD as string, userEmail);
        console.log("Alert email sent successfully.");
      }
      catch (error) {
          console.error('Error sending alert email:', error);
      }
    }
    return NextResponse.json(result);

    } catch (error) {
      console.error("Session verification error:", error);
      return NextResponse.json(
        { valid: false, error: "Internal server error" },
        { status: 500 }
      );
    }
}

function getEmailFromAuthToken(request: NextRequest): string | null {
    try {
        const authToken = request.cookies.get('authToken')?.value;
        if (!authToken) {
            console.log('authToken cookie not found.');
            return null;
        }
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET as string) as { email?: string };
        if (decoded && decoded.email) {
            return decoded.email;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error decoding authToken:', error);
        return null;
    }
}
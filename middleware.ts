import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

const PUBLIC_PATHS = ['/login', '/signup'];
const LISTENER_PATHS = ['/dashboard'];
const ALL_PROTECTED_PATHS = [...LISTENER_PATHS];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isListenerPath = LISTENER_PATHS.includes(pathname);
  const isProtectedPath = ALL_PROTECTED_PATHS.includes(pathname);

  // Check for CORS preflight OPTIONS requests and handle them
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (isPublicPath) {
    if (!token) {
      console.log("Public path, no token - allowing access");
      return NextResponse.next();
    }
    
    // If token exists on public path, verify and redirect if valid
    try {
      const secretKey = new TextEncoder().encode(SECRET_KEY);
      const { payload } = await jose.jwtVerify(token, secretKey);

      console.log(`Public path with valid token - redirecting to /dashboard`);
      return NextResponse.redirect('/dashboard');
    } catch (error) {
      console.error("Token validation error on public path:", error);
      // Invalid token on public path, clear it and allow access
      const response = NextResponse.next();
      console.log(response)
      //response.cookies.delete("authToken");
      return response;
    }
  }
  
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard'
  ],
};
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/login', '/signup', '/','/terms'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('authToken')?.value;
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Handle public routes
  if (isPublicRoute) {
    // If user is authenticated and tries to access login/signup, redirect to dashboard
    if ((pathname === '/login' || pathname === '/signup') && authToken) {
      try {
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
        await jwtVerify(authToken, secretKey);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        // Token is invalid, allow access to login page
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }
  
  // If we reach here, it's a protected route (like /dashboard)
  
  // Check if user has a token
  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify the token
  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
    await jwtVerify(authToken, secretKey);
    
    // Token is valid, allow access
    return NextResponse.next();
    
  } catch (error) {
    console.error('Token verification failed:', error);
    
    // Token is invalid, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    
    // Clear the invalid token
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('authToken');
    
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
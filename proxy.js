import { NextResponse } from "next/server";

export async function proxy(request) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = 
    path === "/login" || 
    path === "/register" || 
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    path.startsWith("/public") ||
    path === "/favicon.ico";

  const sessionToken = request.cookies.get("better-auth.session_token");

  // If user is on a protected route and not logged in, redirect to login
  if (!isPublicRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is on login/register page and is logged in, redirect to dashboard
  if ((path === "/login" || path === "/register") && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected routes and required roles
const protectedRoutes = [
  "/dashboard",
  "/create",
  "/story",
  "/settings", // Added /settings to protected routes for role-based access
];


// Define routes that should be excluded from middleware (public routes)
const excludedRoutes = [
  "/login",
  "/register",
  "/onboarding",
  "/api",
  "/_next",
  "/favicon.ico",
  "/rejected",
  "/waiting-approval", // Exclude waiting-approval from middleware checks
  "/client-dashboard", // Exclude client-dashboard from middleware checks
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for explicitly excluded routes
  if (excludedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Only apply protection logic to defined protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      const cookieName =
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token";

      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET!,
        cookieName,
      });

      // If no token, redirect to login page
      if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // Handle user status and role-based redirections
      const redirectUrl = request.nextUrl.clone();

      if (!token.role || token.role === "") {
        // If token exists but no role, redirect to onboarding
        redirectUrl.pathname = "/onboarding";
        return NextResponse.redirect(redirectUrl);
      }

      if (token.status === "pending") {
        // User is pending approval
        redirectUrl.pathname = "/waiting-approval";
        return NextResponse.redirect(redirectUrl);
      }

      if (token.status === "reject") {
        // User has been rejected
        redirectUrl.pathname = "/rejected";
        return NextResponse.redirect(redirectUrl);
      }

      // Specific role-based access for /settings
      if (pathname.startsWith("/settings") && token.role !== "admin" && token.role !== "accountant") {
        redirectUrl.pathname = "/"; // Redirect non-authorized users from settings
        return NextResponse.redirect(redirectUrl);
      }

      // Redirect 'client' role from general protected routes to their specific dashboard
      if (token.role === "client") {
        redirectUrl.pathname = "/client-dashboard";
        return NextResponse.redirect(redirectUrl);
      }

      // If all checks pass, allow access
      return NextResponse.next();

    } catch (error) {
      console.error("Middleware error:", error);
      // On any middleware error, redirect to login for safety
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Allow request to proceed if not a protected route
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Only run middleware on these specific routes
    "/",
    "/:path*",
  ],
  runtime: "experimental-edge",
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected routes and required roles
const protectedRoutes = [
  "/dashboard", // Protect root path
  "/create",
  "/story",
  
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
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // console.log("Middleware running for path:", pathname);

  // Skip middleware for excluded routes
  if (excludedRoutes.some((route) => pathname.startsWith(route))) {
    // console.log("Skipping middleware for excluded route:", pathname);
    return NextResponse.next();
  }

  // Only check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      const cookieName =
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token" // <-- double underscore!
          : "authjs.session-token";

      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET!,
        cookieName,
      });
      // console.log("Token found:", token ? "Yes" : "No");

      // If no token, redirect to login
      if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // If token exists but no role, redirect to onboarding
      if (!token.role || token.role === "") {
        // console.log("Token found but no role, redirecting to onboarding");
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }

      // Check user status
      if (token.status === "pending") {
        // console.log("User status is pending, redirecting to waiting-approval");
        const url = request.nextUrl.clone();
        url.pathname = "/waiting-approval";
        return NextResponse.redirect(url);
      }

      if (token.status === "reject") {
        // console.log("User status is rejected, redirecting to rejected");
        const url = request.nextUrl.clone();
        url.pathname = "/rejected";
        return NextResponse.redirect(url);
      }

      if (token.status !== "approved") {
        // console.log("User status is not approved, redirecting to login");
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // Optional: Check for specific roles for specific routes
      if (pathname.startsWith("/settings") && token.role !== "admin" && token.role !== "accountant") {
        // console.log(
        //   "Non-admin user trying to access settings, redirecting to dashboard",
        // );
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      // Redirect clients away from admin routes to client dashboard
      if (
        protectedRoutes.some((route) => pathname.startsWith(route)) &&
        token.role === "client"
      ) {
        // console.log(
        //   "Client trying to access admin route, redirecting to client dashboard",
        // );
        const url = request.nextUrl.clone();
        url.pathname = "/client-dashboard";
        return NextResponse.redirect(url);
      }

      // console.log("User authorized, allowing access to:", pathname);
    } catch (error) {
      console.error("Middleware error:", error);
      // On error, redirect to login for safety
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Allow request to proceed
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
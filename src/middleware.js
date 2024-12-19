// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];
  const origin = request.headers.get("origin");

  // Create the response
  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  // Check authentication for protected methods
  if (["POST", "PUT", "DELETE"].includes(request.method)) {
    const sessionCookie = request.cookies.get("session_cookie");
    const isAuthPath = request.nextUrl.pathname.startsWith("/api/auth/");

    if (!isAuthPath && !sessionCookie?.value) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized - Please log in",
        },
        {
          status: 401,
          headers: response.headers,
        }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};

import { NextResponse } from "next/server";

// Constants
const PROTECTED_METHODS = ["POST", "PUT", "DELETE"];
const DEFAULT_ORIGIN = "http://localhost:3000";
const CORS_HEADERS = {
  credentials: "Access-Control-Allow-Credentials",
  origin: "Access-Control-Allow-Origin",
  methods: "Access-Control-Allow-Methods",
  headers: "Access-Control-Allow-Headers",
};

// Helper functions
function getAllowedOrigin(request, allowedOrigins) {
  const origin = request.headers.get("origin");
  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

function setCorsHeaders(response, origin, allowedOrigins) {
  const headers = response.headers;
  const allowedOrigin = getAllowedOrigin({ headers: { get: () => origin } }, allowedOrigins);

  headers.set(CORS_HEADERS.credentials, "true");
  headers.set(CORS_HEADERS.origin, allowedOrigin);
  headers.set(CORS_HEADERS.methods, "GET, POST, PUT, DELETE, OPTIONS");
  headers.set(CORS_HEADERS.headers, "Content-Type, Authorization, X-Requested-With, X-User-Id");
}

export function middleware(request) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [DEFAULT_ORIGIN];
  const origin = request.headers.get("origin");

  // Handle preflight
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response, origin, allowedOrigins);
    return response;
  }

  // For protected methods, check authentication
  if (PROTECTED_METHODS.includes(request.method)) {
    const sessionCookie = request.cookies.get("session_cookie");
    const isAuthPath = request.nextUrl.pathname.startsWith("/api/auth/");

    if (!isAuthPath && !sessionCookie?.value) {
      const response = NextResponse.json(
        {
          status: "error",
          message: "Unauthorized - Please log in",
        },
        { status: 401 }
      );
      setCorsHeaders(response, origin, allowedOrigins);
      return response;
    }

    // Add user ID to headers for authorized requests
    if (sessionCookie?.value) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("X-User-Id", sessionCookie.value);

      const nextRequest = new Request(request.url, {
        method: request.method,
        headers: requestHeaders,
        body: request.body,
      });

      const response = NextResponse.next({
        request: nextRequest,
      });

      setCorsHeaders(response, origin, allowedOrigins);
      return response;
    }
  }

  // For non-protected methods or paths
  const response = NextResponse.next();
  setCorsHeaders(response, origin, allowedOrigins);
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};

export function middleware(request) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];

  const origin = request.headers.get("origin");

  const headers = new Headers(request.headers);

  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: headers,
    });
  }

  return Response.next({
    request: {
      headers: headers,
    },
  });
}

export const config = {
  matcher: [
    "/api/:path*", // Apply to all API routes
  ],
};

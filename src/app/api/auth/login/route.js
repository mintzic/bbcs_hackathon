import db from "@/app/api/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2", [
      username,
      password,
    ]);

    if (existingUser.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    const user = { ...existingUser.rows[0] };
    delete user.password;

    const response = NextResponse.json(
      {
        status: "success",
        message: "Login successful",
        data: user,
      },
      { status: 200 }
    );

    // Set cookie in Next.js 14+ way
    response.cookies.set({
      name: "session_cookie",
      value: user.id.toString(),
      httpOnly: true,
      path: "/",
      // Enable these in production
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict'
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Login failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

import db from "@/app/api/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    // Insert user into database
    const result = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, password]
    );

    const user = result.rows[0];

    // Create response with cookie
    const response = NextResponse.json(
      {
        status: "success",
        message: "User registered successfully",
        data: user,
      },
      { status: 201 }
    );

    // Set session cookie after registration
    response.cookies.set({
      name: "session_cookie",
      value: user.id.toString(),
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Registration failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

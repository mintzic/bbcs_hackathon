import db from "../../db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return Response.json(
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
      return Response.json(
        {
          status: "error",
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    // Insert user into database
    const result = await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [
      username,
      email,
      password,
    ]);

    return Response.json(
      {
        status: "success",
        message: "User registered successfully",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      {
        status: "error",
        message: "Registration failed",
      },
      { status: 500 }
    );
  }
}

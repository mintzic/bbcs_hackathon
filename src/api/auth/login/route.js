import db from "../../db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
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
      return Response.json(
        {
          status: "error",
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    delete existingUser.rows[0].password;

    response.cookies.set({
      name: "session_cookie",
      value: existingUser.rows[0].id.toString(),
      httpOnly: true,
      path: "/",
      // secure: true,
      // sameSite: 'strict'
    });

    return Response.json(
      {
        status: "success",
        message: "Login successful",
        data: existingUser.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      {
        status: "error",
        message: "Login failed",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import db from "@/app/api/db";
import { getOrCreateStatus } from "@/app/api/status";

export async function GET(request) {
  try {
    const profile = await db.query(
      `
        SELECT 
        p.*,
        s.name as status_name,
        a.filename,
        a.url
        FROM profile p
        LEFT JOIN status s ON p.status_id = s.id
        LEFT JOIN profile_asset pa ON p.id = pa.profile_id
        LEFT JOIN asset a ON pa.asset_id = a.id
        WHERE p.user_id = $1
        `,
      [request.headers.get("X-User-Id")]
    );

    return NextResponse.json(
      {
        status: "success",
        data: profile.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get profile by id error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to get profile by id",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { full_name, bio, imgur_client_id, imgur_client_secret, status } = await request.json();

    // Check if profile already exists
    const existingProfile = await db.query("SELECT * FROM profile WHERE user_id = $1", [
      request.headers.get("X-User-Id"),
    ]);
    if (existingProfile.rows.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Profile already exists",
        },
        { status: 400 }
      );
    }

    const status_id = getOrCreateStatus(status);
    const profile = await db.query(
      "INSERT INTO profile (user_id, full_name, bio, imgur_client_id, imgur_client_secret, status_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [request.headers.get("X-User-Id"), full_name, bio, imgur_client_id, imgur_client_secret, status_id]
    );

    return NextResponse.json(
      {
        status: "success",
        data: profile.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create profile",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { full_name, bio, imgur_client_id, imgur_client_secret, status } = await request.json();
    const status_id = getOrCreateStatus(status);
    const profile = await db.query(
      "UPDATE profile SET full_name = $1, bio = $2, imgur_client_id = $3, imgur_client_secret = $4 WHERE user_id = $5 RETURNING *",
      [full_name, bio, imgur_client_id, imgur_client_secret, status_id, request.headers.get("X-User-Id")]
    );

    return NextResponse.json(
      {
        status: "success",
        data: profile.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile by id error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update profile by id",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const profile = await db.query("DELETE FROM profile WHERE user_id = $1 RETURNING *", [
      request.headers.get("X-User-Id"),
    ]);

    return NextResponse.json(
      {
        status: "success",
        data: profile.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete profile by id error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete profile by id",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

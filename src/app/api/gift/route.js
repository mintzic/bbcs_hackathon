import { NextResponse } from "next/server";
import db from "@/app/api/db";
import { getOrCreateStatus } from "../status";

export async function GET(request) {
  try {
    const result = await db.query(
      `
      SELECT 
      g.*,
      s.name as status_name,
      json_agg(
        json_build_object(
            'filename', a.filename,
            'url', a.url
        )
      ) as assets
      FROM gift g
      LEFT JOIN status s ON g.status_id = s.id
      LEFT JOIN gift_asset ga ON g.id = ga.gift_id
      LEFT JOIN asset a ON ga.asset_id = a.id
      WHERE g.user_id = $1 AND s.status NOT IN ('completed', 'cancelled')
      GROUP BY g.id, s.name;
      `,
      [request.headers.get("X-User-Id")]
    );

    return NextResponse.json(
      {
        status: "success",
        data: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get all gifts error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to get all gifts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, description, price } = await request.json();
    const userId = request.headers.get("X-User-Id");

    if (!name || !description || !price) {
      return NextResponse.json(
        {
          status: "error",
          message: "Name, description, and price are required",
        },
        { status: 400 }
      );
    }

    const pendingStatus = await getOrCreateStatus("pending");
    const result = await db.query(
      `
      INSERT INTO gift (name, description, price, user_id, status_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [name, description, price, userId, pendingStatus.id]
    );

    return NextResponse.json(
      {
        status: "success",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create gift error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create gift",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

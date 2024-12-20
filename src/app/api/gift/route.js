import { NextResponse } from "next/server";
import db from "@/app/api/db";

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
      WHERE g.user_id = $1
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

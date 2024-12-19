import { NextResponse } from "next/server";
import db from "@/app/api/db";

export async function GET(request) {
  try {
    const result = await db.query("SELECT * FROM products");

    return NextResponse.json(
      {
        status: "success",
        data: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get all products error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to get all products",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

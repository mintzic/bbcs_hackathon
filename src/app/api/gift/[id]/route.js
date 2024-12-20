import { NextResponse } from "next/server";
import db from "@/app/api/db";

export async function PUT(request, { params }) {
  try {
    const giftId = params.id;
    const body = await request.json();
    const { name, price, description } = body;

    if (!name || !price || !description) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // First check if gift exists
    const checkGift = await db.query("SELECT id FROM products WHERE id = $1", [giftId]);
    if (checkGift.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Gift not found",
        },
        { status: 404 }
      );
    }

    // Check if product belongs to user
    const checkGiftOwner = await db.query("SELECT id FROM gift WHERE id = $1 AND user_id = $2", [
      giftId,
      request.headers.get("X-User-Id"),
    ]);
    if (checkGiftOwner.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Gift does not belong to user",
        },
        { status: 403 }
      );
    }

    // Update
    await db.query("UPDATE gift SET name = $1, price = $2, description = $3 WHERE id = $4", [
      name,
      price,
      description,
      giftId,
    ]);

    return NextResponse.json(
      {
        status: "success",
        message: "Gift updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update gift error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update gift",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const giftId = params.id;

    // First check if gift exists
    const checkGift = await db.query("SELECT id FROM products WHERE id = $1", [giftId]);
    if (checkGift.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Check if gift belongs to user
    const checkGiftOwner = await db.query("SELECT id FROM gift WHERE id = $1 AND user_id = $2", [
      giftId,
      request.headers.get("X-User-Id"),
    ]);
    if (checkGiftOwner.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Gift does not belong to user",
        },
        { status: 403 }
      );
    }

    // Delete product using stored procedure
    await db.query("CALL delete_gift($1)", [giftId]);

    return NextResponse.json(
      {
        status: "success",
        message: "Gift deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete gift error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete gift",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

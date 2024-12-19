import { NextResponse } from "next/server";
import db from "@/app/api/db";

export async function GET(request, { params }) {
  try {
    const productId = params.id;
    const result = await db.query("SELECT * FROM products WHERE id = $1", [productId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: result.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to get product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const productId = params.id;
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

    // First check if product exists
    const checkProduct = await db.query("SELECT id FROM products WHERE id = $1", [productId]);
    if (checkProduct.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Check if product belongs to user
    const checkProductOwner = await db.query("SELECT id FROM products WHERE id = $1 AND user_id = $2", [
      productId,
      request.headers.get("X-User-Id"),
    ]);
    if (checkProductOwner.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product does not belong to user",
        },
        { status: 403 }
      );
    }

    // Update
    await db.query("UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4", [
      name,
      price,
      description,
      productId,
    ]);

    return NextResponse.json(
      {
        status: "success",
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const productId = params.id;

    // First check if product exists
    const checkProduct = await db.query("SELECT id FROM products WHERE id = $1", [productId]);
    if (checkProduct.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Check if product belongs to user
    const checkProductOwner = await db.query("SELECT id FROM products WHERE id = $1 AND user_id = $2", [
      productId,
      request.headers.get("X-User-Id"),
    ]);
    if (checkProductOwner.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product does not belong to user",
        },
        { status: 403 }
      );
    }

    // Delete product using stored procedure
    await db.query("CALL delete_product($1)", [productId]);

    return NextResponse.json(
      {
        status: "success",
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

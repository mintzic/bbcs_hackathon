import db from "../../db";

export async function GET(request, { params }) {
  try {
    const productId = params.id;
    const result = await db.query("SELECT * FROM products WHERE id = $1", [productId]);

    if (result.rows.length === 0) {
      return Response.json(
        {
          status: "error",
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        status: "success",
        data: result.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "Failed to get product",
      },
      { status: 500 }
    );
  }
}

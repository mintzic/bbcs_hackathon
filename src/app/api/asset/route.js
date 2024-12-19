import { NextResponse } from "next/server";
import db from "@/app/api/db";

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const IMGUR_API_URL = "https://api.imgur.com/3/image";

async function uploadToImgur(base64Image) {
  try {
    const response = await fetch(IMGUR_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image, type: "base64" }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.data.error);
    }

    return {
      url: data.data.link,
      deleteHash: data.data.deletehash,
      width: data.data.width,
      height: data.data.height,
      size: data.data.size,
    };
  } catch (error) {
    console.error("Error uploading image to Imgur", error);
    throw new Error("Failed to upload image to Imgur");
  }
}

export async function POST(request) {
  try {
    const { productId, image, title, description } = await request.json();
    const userId = request.headers.get("X-User-Id");

    if (!productId || !image) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product ID and image are required",
        },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to the user
  } catch (error) {
    console.error("Asset upload error: ", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to upload asset",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

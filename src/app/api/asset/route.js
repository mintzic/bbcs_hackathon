import { NextResponse } from "next/server";
import db from "@/app/api/db";
import { getOrCreateStatus } from "../status";

// Constants
const VALID_TYPES = ["gift", "item", "event", "profile"];
const IMGUR_API_URL = "https://api.imgur.com/3/image";
const DEFAULT_STATUS_ID = await getOrCreateStatus("active");

// Helper functions
async function uploadToImgur(base64Image, imgurClientId) {
  const response = await fetch(IMGUR_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${imgurClientId}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image, type: "base64" }),
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.data.error);

  return {
    url: data.data.link,
    deleteHash: data.data.deletehash,
    size: data.data.size,
  };
}

async function validateOwnershipAndGetCredentials(type, referenceId, userId) {
  // Get credentials and check ownership in one query
  const query = `
    SELECT p.imgur_client_id, p.imgur_client_secret
    FROM profile p
    ${
      type !== "profile"
        ? `
    LEFT JOIN ${type} t ON t.user_id = p.user_id 
    WHERE t.id = $1 AND t.user_id = $2
    `
        : "WHERE p.user_id = $1"
    }
  `;

  const queryParams = type === "profile" ? [userId] : [referenceId, userId];
  const result = await db.query(query, queryParams);

  if (!result.rows[0]?.imgur_client_id) {
    throw new Error(
      result.rows.length === 0 ? `${type} not found or doesn't belong to user` : "Imgur credentials not set up"
    );
  }

  return result.rows[0];
}

async function createAssetWithTransaction(client, assetData, type, referenceId) {
  const { filename, fileType, fileSize, url, deleteHash } = assetData;

  // Insert asset
  const assetResult = await client.query(
    `
    INSERT INTO asset (filename, file_type, file_size, url, delete_hash, status_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `,
    [filename, fileType, fileSize, url, deleteHash, DEFAULT_STATUS_ID]
  );

  // Insert junction record
  await client.query(
    `
    INSERT INTO ${type}_asset (${type}_id, asset_id) 
    VALUES ($1, $2)
  `,
    [referenceId, assetResult.rows[0].id]
  );

  return assetResult.rows[0].id;
}

export async function POST(request) {
  const client = await db.connect();
  try {
    const { image, type, referenceId, filename = "untitled" } = await request.json();
    const userId = request.headers.get("X-User-Id");

    // Validation
    if (!image || !type || !referenceId) {
      throw new Error("Image, type, and referenceId are required");
    }
    if (!VALID_TYPES.includes(type)) {
      throw new Error(`Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`);
    }

    // Get credentials and validate ownership
    const { imgur_client_id } = await validateOwnershipAndGetCredentials(type, referenceId, userId);

    // Upload to Imgur
    const imgurData = await uploadToImgur(image, imgur_client_id);

    // Create asset with transaction
    await client.query("BEGIN");
    const assetId = await createAssetWithTransaction(
      client,
      {
        filename,
        fileType: "image",
        fileSize: imgurData.size,
        url: imgurData.url,
        deleteHash: imgurData.deleteHash,
      },
      type,
      referenceId
    );
    await client.query("COMMIT");

    return NextResponse.json({
      status: "success",
      message: "Asset uploaded successfully",
      data: { id: assetId, url: imgurData.url, filename },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Asset upload error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to upload asset",
      },
      { status: error.message.includes("not found") ? 404 : 400 }
    );
  } finally {
    client.release();
  }
}

export async function GET(request) {
  try {
    const userId = request.headers.get("X-User-Id");
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const referenceId = searchParams.get("referenceId");

    if (!VALID_TYPES.includes(type)) {
      throw new Error(`Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`);
    }

    const query = `
      WITH ownership_check AS (
        SELECT id FROM ${type} WHERE ${type === "profile" ? "user_id = $1" : "id = $1 AND user_id = $2"}
      )
      SELECT a.id, a.filename, a.file_type, a.url, a.created_at
      FROM asset a
      JOIN ${type}_asset ja ON a.id = ja.asset_id
      JOIN ownership_check oc ON ${type === "profile" ? "true" : `ja.${type}_id = oc.id`}
      ORDER BY a.created_at DESC
    `;

    const queryParams = type === "profile" ? [userId] : [referenceId, userId];
    const result = await db.query(query, queryParams);

    return NextResponse.json({
      status: "success",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get assets error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to fetch assets",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const userId = request.headers.get("X-User-Id");
    const assetId = request.url.split("/").pop();

    // Get asset details and check ownership in one query
    const detailsQuery = `
      WITH owner_check AS (
        SELECT DISTINCT a.id, a.delete_hash, p.imgur_client_id
        FROM asset a
        CROSS JOIN LATERAL (
          SELECT true WHERE EXISTS (
            SELECT 1 FROM gift_asset ga JOIN gift g ON ga.gift_id = g.id 
            WHERE ga.asset_id = a.id AND g.user_id = $1
            UNION ALL
            SELECT 1 FROM item_asset ia JOIN item i ON ia.item_id = i.id 
            WHERE ia.asset_id = a.id AND i.user_id = $1
            UNION ALL
            SELECT 1 FROM event_asset ea JOIN event e ON ea.event_id = e.id 
            WHERE ea.asset_id = a.id AND e.user_id = $1
            UNION ALL
            SELECT 1 FROM profile_asset pa JOIN profile p ON pa.profile_id = p.id 
            WHERE pa.asset_id = a.id AND p.user_id = $1
          )
        ) AS ownership
        JOIN profile p ON p.user_id = $1
        WHERE a.id = $2
      )
      SELECT * FROM owner_check LIMIT 1
    `;

    const details = await db.query(detailsQuery, [userId, assetId]);

    if (details.rows.length === 0) {
      throw new Error("Asset not found or doesn't belong to user");
    }

    const { imgur_client_id, delete_hash } = details.rows[0];

    // Delete from Imgur
    const imgurResponse = await fetch(`${IMGUR_API_URL}/${delete_hash}`, {
      method: "DELETE",
      headers: { Authorization: `Client-ID ${imgur_client_id}` },
    });

    if (!imgurResponse.ok) {
      console.error("Imgur deletion warning:", await imgurResponse.text());
    }

    // Delete from database
    await db.query("DELETE FROM asset WHERE id = $1", [assetId]);

    return NextResponse.json({
      status: "success",
      message: "Asset deleted successfully",
    });
  } catch (error) {
    console.error("Delete asset error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to delete asset",
      },
      { status: error.message.includes("not found") ? 404 : 500 }
    );
  }
}

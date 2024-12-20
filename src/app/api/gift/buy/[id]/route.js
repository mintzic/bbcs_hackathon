import { NextResponse } from "next/server";
import db from "@/app/api/db";
import { getOrCreateStatus } from "@/app/api/status";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { amount } = await request.json();
    const userId = request.headers.get("X-User-Id");

    if (!id || !amount) {
      return NextResponse.json(
        {
          status: "error",
          message: "Gift id and amount are required",
        },
        { status: 400 }
      );
    }

    // Get gift and verify it exists
    const gift = await db.query(`SELECT * FROM gift WHERE id = $1`, [id]);

    if (gift.rows.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Gift not found",
        },
        { status: 404 }
      );
    }

    // Get completed status
    const completedStatus = await getOrCreateStatus("completed");

    // Check if gift is already bought
    if (gift.rows[0].status_id === completedStatus.id) {
      return NextResponse.json(
        {
          status: "error",
          message: "Gift is already bought",
        },
        { status: 400 }
      );
    }

    // Get wallet and check balance
    const wallet = await db.query(`SELECT * FROM wallet WHERE user_id = $1`, [userId]);

    if (wallet.rows[0].balance < amount) {
      return NextResponse.json(
        {
          status: "error",
          message: "Insufficient balance",
        },
        { status: 400 }
      );
    }

    // Get previous transactions
    const transactions = await db.query(`SELECT * FROM transaction WHERE gift_id = $1`, [id]);

    const totalPaid = transactions.rows.reduce((acc, curr) => acc + curr.amount, 0);
    const remainingAmount = gift.rows[0].price - totalPaid;

    // Begin transaction
    await db.query("BEGIN");

    try {
      let actualPayment = amount;
      let refundAmount = 0;

      // If payment exceeds remaining amount, calculate refund
      if (amount > remainingAmount) {
        actualPayment = remainingAmount;
        refundAmount = amount - remainingAmount;
      }

      // Create transaction record for actual payment
      await db.query(
        `INSERT INTO transaction (wallet_id, gift_id, amount, status_id) 
           VALUES ($1, $2, $3, $4)`,
        [wallet.rows[0].id, id, actualPayment, completedStatus.id]
      );

      // Deduct full amount first
      await db.query(`UPDATE wallet SET balance = balance - $1 WHERE id = $2`, [amount, wallet.rows[0].id]);

      // If there's a refund, add it back to wallet
      if (refundAmount > 0) {
        await db.query(`UPDATE wallet SET balance = balance + $1 WHERE id = $2`, [refundAmount, wallet.rows[0].id]);
      }

      // Update gift status to completed since we're paying the remaining amount
      await db.query(`UPDATE gift SET status_id = $1 WHERE id = $2`, [completedStatus.id, id]);

      await db.query("COMMIT");

      const message =
        refundAmount > 0
          ? `Payment processed successfully. Refunded ${refundAmount} to your wallet.`
          : "Payment processed successfully";

      return NextResponse.json(
        {
          status: "success",
          message,
          refundAmount: refundAmount > 0 ? refundAmount : null,
        },
        { status: 200 }
      );
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Buy gift error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to process payment",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

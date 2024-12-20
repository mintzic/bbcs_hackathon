import db from "@/app/api/db";

async function getOrCreateStatus(statusName) {
  const status = await db.query("SELECT * FROM status WHERE name = $1", [statusName]);

  if (status.rows.length === 0) {
    const newStatus = await db.query("INSERT INTO status (name) VALUES ($1) RETURNING *", [statusName]);
    return newStatus.rows[0].id;
  }

  return status.rows[0].id;
}

export { getOrCreateStatus };

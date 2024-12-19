import pg from "pg";
import pgCamelCase from "pg-camelcase";

pgCamelCase.inject(pg);

const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  max: parseInt(process.env.DB_CONNECTION_LIMIT || "20"),
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

if (process.env.NODE_ENV !== "production") {
  const originalQuery = pool.query;
  pool.query = function (...args) {
    const [sql, params] = args;
    console.log("EXECUTING QUERY:", sql, params);
    return originalQuery.apply(pool, args);
  };
}

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;

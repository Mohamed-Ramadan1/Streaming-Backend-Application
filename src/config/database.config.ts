// src/config/database.ts
import { Pool } from "pg";
import { user, password, host, port, database } from "./index.config";

const pool = new Pool({
  user,
  password,
  host,
  port,
  database,
});

const connectDatabase = async () => {
  console.log("Connecting to DB with:", {
    user,
    host,
    port,
    database,
  });

  try {
    const client = await pool.connect();
    console.log("Database connected successfully");

    client.release(); // Release the connection back to the pool
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process with failure code
  }
};

export { pool, connectDatabase };

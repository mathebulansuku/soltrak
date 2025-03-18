import { Client } from "pg";

const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

db.connect().catch((err) => {
  console.error("Failed to connect to the database:", err);
});

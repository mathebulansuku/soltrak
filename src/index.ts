import express from "express";
import { Client } from "pg";
import dotenv from "dotenv";
import axios from "axios";

const app = express();
const PORT = 3000;
const DATA_URL =
  "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiZwptKq43saOqcOSOQN8Trhs4p_D05HXIU_c9xzARMMbXvFL-saAYOK8_Rp0MvkVN5u9NPkv6d0jf09LrQib8KyEtbOQm8A_mVar7t6jr8TFWcm210P4VGIlbB6BbVolxV5wdnCDhm3N1jlZrlRcnSBHTXHDVpsxixxxJG29oBa-3eYnksGFH3cKASudVBxcoAqszgBoItisZ3aZ0sKTRk2yklmgf2fZAShRDXrS519zsTArEcI1T6wNoqSZsiTBuMPV7CesZYAy8ySX9AWimBT7ewIsnaUG1adoQnSb6fbYH0ODUNTJZgl-g7Eg&lib=MR_mt8Wmapn2W5zwbI-xTtMWO3py5UuMP";

dotenv.config();

const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});
db.connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(DATA_URL);
    const data = response.data;
    res.json(data);

    for (const item of data) {
      const { timestamp, temp, dni, ghi, humidity, pressure, wind, power } =
        item;

      await db.query(
        "INSERT INTO solcast_data(timestamp, temp, dni, ghi, humidity, pressure, wind, power) VALUES($1, $2, $3, $4,$5, $6, $7, $8)",
        [timestamp, temp, dni, ghi, humidity, pressure, wind, power]
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

db.query("INSERT INTO solcast_data");

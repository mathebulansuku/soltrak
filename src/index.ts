import express from "express";
import { Client } from "pg";
import dotenv from "dotenv";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
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

db.connect();
console.log("Connected to database");

async function fetchData() {
  try {
    const response = await axios.get(DATA_URL);
    const data = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function insertData(data:any){
  try {

    const data = await fetchData();
    for (const item of data) {

      const {
        timestamp,
        temperature,
        dni,
        ghi,
        humidity,
        pressure,
        wind,
        powerPV,
      } = item;

      if (
        !timestamp ||
        temperature == null ||
        dni == null ||
        ghi == null ||
        humidity == null ||
        pressure == null ||
        wind == null ||
        powerPV == null
      ) {
        console.warn("Skipping invalid entry:", item);
        continue;
      }

      await db.query(
        "INSERT INTO solcast_data (timestamp, temperature, dni, ghi, humidity, pressure, wind, powerPV) VALUES($1, $2, $3, $4,$5, $6, $7, $8)",
        [timestamp, temperature, dni, ghi, humidity, pressure, wind, powerPV]
      );
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

db.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });

type SolarData = {
  period_end: Date;
  air_temp: number;
  dni: number;
  ghi: number;
  relative_humidity: number;
  surface_pressure: number;
  wind_speed_10m: number;
  pv_power_rooftop: number;
};

export async function insertSolarData(data: SolarData) {
  try {
    await db.query(
      "INSERT INTO solcast_data (timestamp, air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        data.period_end,
        data.air_temp,
        data.dni,
        data.ghi,
        data.relative_humidity,
        data.surface_pressure,
        data.wind_speed_10m,
        data.pv_power_rooftop,
      ]
    );
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

import { Client } from "pg";

type SolarData = {
  timestamp: Date;
  air_temp: number;
  dni: number;
  dhi: number;
  relative_humidity: number;
  surface_pressure: number;
  wind_speed_10m: number;
  pv_power_rooftop: number;
};

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

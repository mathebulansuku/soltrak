import express from "express";
import dotenv from "dotenv";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_URL =
  "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiZwptKq43saOqcOSOQN8Trhs4p_D05HXIU_c9xzARMMbXvFL-saAYOK8_Rp0MvkVN5u9NPkv6d0jf09LrQib8KyEtbOQm8A_mVar7t6jr8TFWcm210P4VGIlbB6BbVolxV5wdnCDhm3N1jlZrlRcnSBHTXHDVpsxixxxJG29oBa-3eYnksGFH3cKASudVBxcoAqszgBoItisZ3aZ0sKTRk2yklmgf2fZAShRDXrS519zsTArEcI1T6wNoqSZsiTBuMPV7CesZYAy8ySX9AWimBT7ewIsnaUG1adoQnSb6fbYH0ODUNTJZgl-g7Eg&lib=MR_mt8Wmapn2W5zwbI-xTtMWO3py5UuMP";

dotenv.config();

async function fetchData() {
  try {
    const response = await axios.get(DATA_URL);
    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

async function insertData() {
  try {
    const data = await fetchData();

    if (data.length === 0) {
      console.error("No data to insert:", data);
      return;
    }

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

      try {
        await db.query(
          "INSERT INTO solcast_data (timestamp, temperature, dni, ghi, humidity, pressure, wind, powerPV) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
          [timestamp, temperature, dni, ghi, humidity, pressure, wind, powerPV]
        );
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

app.get("/", async (req, res) => {
  try {
    await insertData();
    res.send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

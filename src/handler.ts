import { insertSolarData } from "./postgres";
import axios from "axios";

const DATA_URL =
  "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh5WAjIIUPnqTa-ud-83lt8H4uFjcy9tdSKm4UVWi2Si3KaO8XS6oCRaJOpHkSaEzLObdCLbzMs34w8YOo8g5-_puSVZ-Bc-xOC1Wue8B2b03Pwx-dh_AZ4xp8vYeOG3HqTFFK90VG0_lRLYQf1zSGTQVmxg5ikjzTlo7SiJduT6IUs-sL1cBGtW_3NeEhTQY_XeXEZz_E7zTiykpcvdO4o3Adnt6d_nN2RHddpLi7Jr5Okwy-JFO8ropgQwK26oshe5RW4l1D2wxX4qGeFFKTv8TkCgRN6B7j11SvNQxsSLYPLUKm73TFDsrX-cQ&lib=MR_mt8Wmapn2W5zwbI-xTtMWO3py5UuMP";

type data = {
  weather: {
    air_temp: number;
    dni: number;
    dhi: number;
    relative_humidity: number;
    surface_pressure: number;
    wind_speed_10m: number;
  }[];

  powerPV: {
    pv_power_rooftop: number;
  }[];
};

export const handler = async () => {
  try {
    const response = await axios.get(DATA_URL);
    const weatherData = response.data.weatherData[0];
    const powerData = response.data.powerPV[0];

    const processedData = {
      timestamp: new Date(),
      air_temp: weatherData.air_temp,
      dni: weatherData.dni,
      dhi: weatherData.dhi,
      relative_humidity: weatherData.relative_humidity,
      surface_pressure: weatherData.surface_pressure,
      wind_speed_10m: weatherData.wind_speed_10m,
      pv_power_rooftop: powerData.pv_power_rooftop * 1000,
    };

    await insertSolarData(processedData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data saved successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "You are not authorized!" }),
    };
  }
};

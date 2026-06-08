import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const city = "Incheon"; // 기본 도시 설정
  const lang = "kr";
  const apiKey = process.env.OPENWEATHER_API_KEY;

  console.log(request);

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENWEATHER_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: apiKey,
          lang,
          units: "metric",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}

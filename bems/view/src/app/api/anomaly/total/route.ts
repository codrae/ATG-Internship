import { NextRequest, NextResponse } from "next/server";
import { AnomalyItem } from "@/types";

const BASE_URL = process.env.SPRING_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const count = searchParams.get("count");

  try {
    const url = `${BASE_URL}/anomaly/total?count=${encodeURIComponent(count || 0)}`;
    console.log(`요청 url : ${url}`);

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { message: `Failed to fetch data: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data: AnomalyItem[] = await res.json();

    const filteredData = data.map((item: AnomalyItem) => ({
      buildingName: item.building?.name || "Unknown",
      value: item.value,
      createdAt: item.createdAt,
      predict: item.predict,
    }));

    // console.log("/Filtered Data:", filteredData);

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("Error fetching anomaly data:", error);
    return NextResponse.json(
      { message: "Unexpected error occurred", error: String(error) },
      { status: 500 },
    );
  }
}

// 사용자 그룹이 지정한 목표 에너지 사용량

import { NextRequest, NextResponse } from "next/server";
import { EnergyUsage } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const clientId = searchParams.get("clientId");

  try {
    const url = `${process.env.SPRING_URL}/api/client/target-usage?clientId=${clientId}`;
    console.log(`요청 url : ${url}`);

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { message: `Failed to fetch data: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data: EnergyUsage[] = await res.json();

    const goalData = data.map((item: EnergyUsage) => ({
      value: item.value,
    }));

    return NextResponse.json(goalData);
  } catch (error) {
    console.error("Error fetching anomaly data:", error);
    return NextResponse.json(
      { message: "Unexpected error occurred", error: String(error) },
      { status: 500 },
    );
  }
}

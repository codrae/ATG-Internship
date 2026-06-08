/*
  특정 건물 대상- 선택 기간동안의 에너지 raw 데이터 반환
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // 파라미터 가져오기
  const building_id = searchParams.get("building-id") || "Unknown";
  const energy_type = searchParams.get("energy-type") || "Unknown";

  try {
    const queryParams = new URLSearchParams({
      building_id: building_id || "Unknown",
      energy_type: energy_type || "Unknown",
    });
    const res = await fetch(
      `${process.env.SPRING_URL}/ai/generate?${queryParams.toString()}`,
      {
        method: "GET",
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch AI response: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return NextResponse.json(
      { error: `Internal server error` },
      { status: 500 },
    );
  }
}

/*
  특정 건물 대상- 선택 기간동안의 에너지 raw 데이터 반환
 */
import { NextRequest, NextResponse } from "next/server";
import { DateHelper } from "@/utils/DateHelper";

export async function GET(
  request: NextRequest,
  { params }: { params: { energy_type: string } },
) {
  const { searchParams } = request.nextUrl;

  // 파라미터 가져오기
  const measurement = searchParams.get("measurement") || "Unknown";
  const start = searchParams.get("start") || new Date();
  const end = searchParams.get("end") || new Date();

  console.log("predict getList fetching 동작 중...");

  try {
    const queryParams = new URLSearchParams({
      measurement: measurement || "Unknown",
      start: DateHelper.toKSTISODate(new Date(start)),
      end: DateHelper.toKSTISODate(new Date(end)),
    });
    const res = await fetch(
      `${process.env.SPRING_URL}/api/${params.energy_type}/getList/predict?${queryParams.toString()}`,
      {
        method: "GET",
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch energyRawData: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching energyRawData:", error);
    return NextResponse.json(
      { error: `Internal server error` },
      { status: 500 },
    );
  }
}

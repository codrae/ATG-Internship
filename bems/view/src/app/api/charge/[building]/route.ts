// app/api/cost/[building]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { urlToBuildingId } from "@/data/buildings";

export async function GET(
  request: NextRequest,
  { params }: { params: { building: string } },
) {
  const building = params.building;

  const { searchParams } = request.nextUrl;
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) {
    return NextResponse.json(
      { message: "Year and month are required." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${process.env.SPRING_URL}/charge/${urlToBuildingId[building]}?year=${year}&month=${month}`,
    );
    console.log(
      `url : ${process.env.SPRING_URL}/charge/${building}?year=${year}&month=${month}`,
    );

    // 응답 본문을 한 번만 읽습니다.
    const chargeText = await response.text();
    const cost = parseFloat(chargeText);
    console.log("cost : " + cost);

    // cost를 객체로 감싸서 반환합니다.
    return NextResponse.json({ cost });
  } catch (error) {
    console.error("Failed to fetch data from server:", error);
    return NextResponse.json(
      { message: "Data fetching failed", error },
      { status: 500 },
    );
  }
}

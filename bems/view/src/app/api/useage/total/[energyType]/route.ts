// app/api/useage/[building]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { energyType: string } },
) {
  console.log("Params:", params);

  const { searchParams } = request.nextUrl;
  const energyType = params.energyType;
  const today = searchParams.get("start");
  const firstDayOfMonth = searchParams.get("end");

  if (!today || !firstDayOfMonth) {
    return NextResponse.json(
      { message: "Year and month are required." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${process.env.SPRING_URL}/api/electricity/total?start=${firstDayOfMonth}&end=${today}&energyType=${energyType}`,
    );
    console.log(
      `url : ${process.env.SPRING_URL}/api/electricity/total?start=${firstDayOfMonth}&end=${today}&energyType=${energyType}`,
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

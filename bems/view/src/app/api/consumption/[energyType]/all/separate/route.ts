import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { energyType: string } },
) {
  const energyType = params.energyType;

  // URLSearchParams를 사용해 쿼리 파라미터 추출
  const url = new URL(req.url);
  const year = url.searchParams.get("year") || new Date().getFullYear(); // 현재 연도 기본값
  const month = url.searchParams.get("month") || new Date().getMonth() + 1; // 현재 월 기본값 (0-indexed)

  console.log("params:", params);
  console.log("energyType:", energyType);
  console.log("year:", year, "month:", month);

  try {
    const res = await fetch(
      `${process.env.SPRING_URL}/consumption/${energyType}/all/separate?year=${year}&month=${month}`,
    );

    console.log(
      `${process.env.SPRING_URL}/consumption/${energyType}/all/separate?year=${year}&month=${month}`,
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: `Failed to fetch data: ${res.statusText}` },
        { status: res.status },
      );
    }

    const monthTodayUsage = await res.json();
    return NextResponse.json(monthTodayUsage);
  } catch (error) {
    console.error(`Error fetching data for energy type ${energyType}:`, error);
    return NextResponse.json(
      { message: "Unexpected error occurred", error: String(error) },
      { status: 500 },
    );
  }
}

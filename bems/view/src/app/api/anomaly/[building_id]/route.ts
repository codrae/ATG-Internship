import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { building_id: number } },
) {
  const { searchParams } = request.nextUrl;
  const count = searchParams.get("count"); // URL의 쿼리 파라미터에서 count를 가져옴

  try {
    // Spring 서버 URL로 요청 보내기
    const response = await fetch(
      `${process.env.SPRING_URL}/anomaly/total/${params.building_id}?count=${count}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json(); // Spring 서버의 응답 데이터를 JSON으로 파싱
    return NextResponse.json(data); // 클라이언트로 데이터 반환
  } catch (error) {
    console.error("Error fetching data from Spring server:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

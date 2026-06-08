import { NextResponse } from "next/server";

export async function GET() {
  const API_URL =
    "https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst";

  // 현재 날짜와 시간 가져오기
  const now = new Date();

  // YYYYMMDD 형식의 base_date 생성
  const base_date = now.toISOString().slice(0, 10).replace(/-/g, "");

  // 사용할 base_time 배열
  const availableBaseTimes = [23, 20, 17, 14, 11, 8, 5, 2];

  // 현재 시간을 기반으로 가장 가까운 base_time 선택
  const currentHour = now.getHours();
  let closestBaseTime = availableBaseTimes[0];

  for (let i = 0; i < availableBaseTimes.length; i++) {
    if (currentHour >= availableBaseTimes[i]) {
      closestBaseTime = availableBaseTimes[i];
      break;
    }
  }

  // closestBaseTime을 HH00 형식으로 변환
  const base_time = String(closestBaseTime).padStart(2, "0") + "00";

  const queryParams = new URLSearchParams({
    pageNo: "1",
    numOfRows: "150",
    dataType: "JSON",
    base_date,
    base_time,
    nx: "55",
    ny: "124",
    authKey: "Gk27rs3ETp6Nu67NxC6e8A",
  });

  try {
    // Fetch API 호출
    const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 응답 상태 확인
    if (!response.ok) {
      console.error("API Fetch Failed:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch weather data" },
        { status: response.status },
      );
    }

    // 데이터 파싱
    const data = await response.json();
    console.log("Weather Data Fetched Successfully:", data);

    return NextResponse.json(data);
  } catch (error) {
    // 에러 핸들링
    console.error("API Fetch Error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching weather data" },
      { status: 500 },
    );
  }
}

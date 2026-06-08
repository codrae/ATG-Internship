import axios from "axios";

interface FetchAlarmParams {
  count?: number; // count는 선택적 속성
}

export const fetchAlarm = async (endpoint: string, count?: number) => {
  console.log(
    `--------------Fetching alarm data from endpoint: ${endpoint}, count: ${count ?? "all"}`,
  );

  try {
    // 기본 URL 설정
    const url = `/api/alarm/${endpoint}`;

    // 파라미터 설정
    const params: FetchAlarmParams = {}; // 명확한 타입으로 변경
    if (count !== undefined) {
      params.count = count;
    }

    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
    return null;
  }
};

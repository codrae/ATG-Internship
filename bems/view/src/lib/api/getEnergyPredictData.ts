import { DataPoint } from "@/types";

export async function fetchEnergyPredictData(
  measurement: string,
  energyType: string,
  startDate?: Date,
  endDate?: Date, // 미래 시간 입력
): Promise<DataPoint[]> {
  console.log("fetchEnergyPredictData 실행 중", startDate, endDate);
  const params = new URLSearchParams({
    measurement: measurement,
    start: startDate ? startDate.toISOString() : "",
    end: endDate ? endDate.toISOString() : "",
  });
  const res = await fetch(
    `/api/predictData/${energyType}/getList?${params.toString()}`,
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
}

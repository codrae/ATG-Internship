import { DataPoint } from "@/types";

export async function fetchEnergyRawData(
  measurement: string,
  energyType: string,
  startDate?: Date,
  endDate?: Date,
): Promise<DataPoint[]> {
  const params = new URLSearchParams({
    measurement: measurement,
    start: startDate ? startDate.toISOString() : "",
    end: endDate ? endDate.toISOString() : "",
  });

  const res = await fetch(
    `/api/rawData/${energyType}/getList?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json();
}

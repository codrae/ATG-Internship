// hooks/useAnomalyData.ts
import { useQuery } from "@tanstack/react-query";

export interface FilteredAnomalyItem {
  buildingName: string; // 건물 이름
  value: number; // 측정된 값
  createdAt: string; // 생성된 시간
  predict: number; // 예측 값
}

const API_URL = `/api/anomaly/total?count=3`;

export const useAnomalyData = () => {
  return useQuery<FilteredAnomalyItem[]>({
    queryKey: ["anomalyData"], // 쿼리 키
    queryFn: async (): Promise<FilteredAnomalyItem[]> => {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }
      return res.json();
    },
    staleTime: Infinity, // 임의로 재로딩 막아둠
  });
};

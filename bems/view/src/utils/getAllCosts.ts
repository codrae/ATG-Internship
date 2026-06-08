import axios from "axios";
import { buildingsDict } from "@/data/buildings";

interface CostResponse {
  cost: number;
}

export const getAllCost = async (): Promise<number> => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const buildings = Object.keys(buildingsDict);

    // 각 건물의 비용을 가져오는 프로미스 배열 생성
    const costPromises = buildings.map(async (building): Promise<number> => {
      try {
        const response = await axios.get<CostResponse>(
          `/api/cost/${building}`,
          {
            params: { year, month },
          },
        );
        const data = response.data;
        return data.cost;
      } catch (error) {
        console.error(`${building}의 비용을 가져오는 데 실패했습니다:`, error);
        return 0; // 오류 발생 시 해당 건물의 비용은 0으로 처리
      }
    });

    // 모든 건물의 비용을 병렬로 가져오기
    const costs = await Promise.all(costPromises);

    // 비용 합산
    return costs.reduce((acc: number, cost: number) => acc + cost, 0);
  } catch (error) {
    console.error("전체 비용을 계산하는 중 오류가 발생했습니다:", error);
    return 0; // 오류 발생 시 총 비용은 0으로 반환
  }
};

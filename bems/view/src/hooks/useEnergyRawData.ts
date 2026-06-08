// 하나의 건물 하나의 에너지원 raw 데이터를 관리하는 쿼리

import { useQuery } from "@tanstack/react-query";
import { DataPoint } from "@/types";
import { fetchEnergyRawData } from "@/lib/api/getEnergyRawData";

function useEnergyRawData(
  measurement: string,
  energyType: string,
  startDate?: Date,
  endDate?: Date,
) {
  return useQuery<DataPoint[], Error>({
    queryKey: ["energyRawData", measurement, energyType],
    queryFn: () =>
      fetchEnergyRawData(measurement, energyType, startDate, endDate),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    throwOnError: true,
  });
}

export default useEnergyRawData;

/*
    에너지 모니터링 - 전체 에너지 페이지의 금일 에너지 총 사용량 & 금일 총 누적 요금 카드 컨테이너
 */

import { useQuery } from "@tanstack/react-query";
import { TodayUsageInnerCard } from "@/components/Cards/monitoring/TodayUsageInnerCard";
import MyEcharts from "@/components/Charts/MyEcharts";
import Gauge from "@/components/Charts/options/Gauge";
import React from "react";
import { EnergyTypeId } from "@/data/buildings";

interface BuildingPageProps {
  building_id: number;
  energy_type: number;
}

const useMonthlyTotalEnergyUsageQuery = ({
  building_id,
  energy_type,
}: BuildingPageProps) => {
  const energyType = EnergyTypeId[energy_type];
  console.log("TodayUsageCardsContainer 의 energyType", energyType);

  return useQuery({
    queryKey: ["todayTotalEnergyUsage", building_id, energy_type],
    queryFn: async () => {
      const response = await fetch(
        `/api/usage/${building_id}/${energyType}/month/today`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};

const useMonthlyTotalEnergyCostQuery = (building_id: number) => {
  console.log("useTodayTotalEnergyCostQuery 실행 중: ", building_id);
  return useQuery<number, Error>({
    queryKey: ["todayTotalEnergyCost", building_id],
    queryFn: async () => {
      const response = await fetch(`/api/charge/${building_id}/today`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};

export default function TodayUsage({
  building_id,
  energy_type,
}: BuildingPageProps) {
  const { data: usageData, isLoading: usageIsLoading } =
    useMonthlyTotalEnergyUsageQuery({
      building_id,
      energy_type,
    });

  const { data: costData, isLoading: costIsLoading } =
    useMonthlyTotalEnergyCostQuery(building_id);

  console.log("usageData 값: ", usageData, "usageData value 값: ", usageData);

  const formattedTotalUsage = usageIsLoading
    ? "불러오는 중..."
    : usageData !== undefined
      ? usageData
      : "데이터 불러오기 실패";

  const formattedTotalCost = costIsLoading
    ? "불러오는 중..."
    : costData !== undefined
      ? costData
      : "데이터 불러오기 실패";

  return (
    <div className="flex flex-row items-center justify-center">
      <TodayUsageInnerCard
        label="금일 에너지 총 사용량"
        content={
          <MyEcharts
            option={Gauge(70, 100, { show: false })} // show: false로 detail 숨기기
            style={{ width: "120px", height: "120px" }}
          />
        }
        unit="TJ"
        usageValue={formattedTotalUsage}
        comparisonValue={1000000}
        boxColor="bg-sky-100"
        comment="설정 목표 대비"
        suffix="사용"
      />

      <TodayUsageInnerCard
        label="금일 총 누적요금"
        content={
          <MyEcharts
            option={Gauge(70, 100, { show: false })} // show: false로 detail 숨기기
            style={{ width: "120px", height: "120px" }}
          />
        }
        unit="만원"
        usageValue={formattedTotalCost}
        comparisonValue={140000}
        boxColor="bg-sky-100"
        comment="설정 목표 대비"
        suffix="사용"
      />
    </div>
  );
}

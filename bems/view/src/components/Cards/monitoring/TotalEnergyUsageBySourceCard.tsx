// 에너지 모니터링 - 전체 에너지 페이지의 에너지원별 총 사용량 카드

import { useQuery } from "@tanstack/react-query";
import { BuildingId } from "@/data/buildings";
import {
  createHorizontalStackedBar,
  HorizontalBarData,
} from "@/components/Charts/options/HorizontalStackedBar";
import formatWithcommas from "@/utils/formatWithcommas";
import MyEcharts from "@/components/Charts/MyEcharts";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BuildingIdProps {
  building_id: number;
}

const fetchTotalEnergyUsageBySource = async (
  building_id: string,
  year: number,
  month: number,
  date: number,
) => {
  const response = await fetch(
    `/api/charge/${building_id}?year=${year}&month=${month}&date=${date}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch cost data: ${response.statusText}`);
  }
  const data = await response.json();
  return data?.cost ?? 0;
};

const getCurrentDate = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
  };
};

function TotalEnergyUsageBySourceCard({ building_id }: BuildingIdProps) {
  const { year, month, date } = getCurrentDate();
  const {
    data: totalCostByBuilding,
    isLoading,
    error,
  } = useQuery<number>({
    queryKey: ["monthlyCostByBuildingId", building_id],
    queryFn: () =>
      fetchTotalEnergyUsageBySource(BuildingId[building_id], year, month, date),
  });

  // 차트 데이터
  const chartData: HorizontalBarData[] = [
    {
      name: "열",
      value: 15,
      color: "#FF6384",
      icon: "/images/icon/Heat.png",

      // icon: <Zap size={12} color={"#FB7185"} />,
    },
    {
      name: "전기",
      value: 60,
      color: "#FFCE56",
      icon: "/images/icon/Lightning.png",
      // icon: <Lightbulb size={12} color={"#D97706"} />,
    },
    {
      name: "가스",
      value: 25,
      color: "#7D7DFF",
      icon: "/images/icon/Gas.png",

      // icon: <Fuel size={12} color={"#4F46E5"} />,
    },
  ];

  // 비용 포맷팅
  const formattedCost = isLoading
    ? "불러오는 중..."
    : totalCostByBuilding !== undefined
      ? `${formatWithcommas({ value: totalCostByBuilding, label: "" })}`
      : "데이터 불러오기 실패";

  return (
    <Card className="max-w-full-[650px]">
      <CardHeader>
        <CardTitle className="text-left text-lg font-bold leading-7">
          에너지원별 총 사용량
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-center gap-6">
        <p className="text-3xl font-bold">{formattedCost}</p>
        {/* 에러 처리 및 차트 렌더링 */}
        {error ? (
          <p className="text-red-500">{`에러 발생: ${error.message}`}</p>
        ) : (
          <MyEcharts
            option={createHorizontalStackedBar(chartData)}
            style={{ width: "800px", height: "80px" }}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default TotalEnergyUsageBySourceCard;

/*
    건축물 에너지 효율 등급 카드
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { createBarOption } from "@/components/Charts/options/Bar";
import MyEcharts from "@/components/Charts/MyEcharts";
import { useQuery } from "@tanstack/react-query";
import { urlToBuildingKorean } from "@/data/buildings";

interface EnergyGradeCardProps {
  building_id: number;
}
interface Builidng {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  id: number;
  name: string;
  buildingType: string;
  address: string;
  completionDate: Date;
  totalArea: number;
}

export const fetchBuildingMonthlyUsage = async (
  url: string,
): Promise<number> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }
  return res.json();
};

const fetchBuildingInfo = async (url: string): Promise<Builidng> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }
  return res.json();
};

function EnergyGradeCard({ building_id }: EnergyGradeCardProps) {
  const energyType = "POWER";
  const API_URL = `/api/api/building/${building_id}/${energyType}/month/today`;
  const {
    data: usageData,
    error,
    isLoading,
  } = useQuery<number>({
    queryKey: ["buildingMonthTodayUsage", building_id],
    queryFn: () => fetchBuildingMonthlyUsage(API_URL),
  });

  const API_URL_BUILDING = `/api/building/${building_id}`;
  const {
    data: buildingData,
    isLoading: buildingLoading,
    error: buildingError,
  } = useQuery<Builidng>({
    queryKey: ["buildingMonthTodayUsage", building_id],
    queryFn: () => fetchBuildingInfo(API_URL_BUILDING),
  });

  if (isLoading || buildingLoading) {
    return <div className="flex items-center">Loading...</div>;
  }

  if (error || buildingError) {
    return <div className="flex items-center">Error loading data</div>;
  }

  const buildingArea = buildingData ? buildingData.totalArea : 0;
  console.log(`${urlToBuildingKorean[building_id]} 의 면적:${buildingArea}`);

  const area = 17066.05;
  let standardUnit;
  if (area > 20000) {
    standardUnit = 74 * 1.11 * area;
  } else if (area > 10000) {
    standardUnit = 64 * 1.11 * area;
  } else {
    standardUnit = 0;
  }

  const usage = usageData ? usageData : 0;
  console.log(
    `${building_id} 건물의 기준값 , ${standardUnit}. "실사용값" : ${usage}`,
  );

  const ratio = Math.round(usage / standardUnit) * 100;

  // 바 그래프 설정
  const mockData = [
    { name: "기준", value: 150 },
    { name: "올해", value: 120 },
  ];

  // 바 차트 색상 설정
  const barColors = ["#E2E8F0", "#38BDF8"]; // 각 바에 대한 색상

  // 차트 옵션 생성
  const barOption = createBarOption(mockData, { colors: barColors });

  return (
    <Card className="col-span-21">
      <CardHeader className="flex-col px-6 pb-2 gap-1 w-full">
        <CardTitle className="text-left text-lg font-bold leading-7 ">
          건출물 에너지 효율 등급
        </CardTitle>
        <CardDescription className="text-left text-sm font-normal mt-0">
          한국에너지공단 건축물 에너지효율등급 인증제도 기준
        </CardDescription>
      </CardHeader>
      <CardContent className={"grid grid-cols-2 gap-4"}>
        <div className={"flex flex-col mx-2 gap-y-1"}>
          <div className={"p-4 h-[88px] text-left"}>
            <p className={"font-bold text-lg"}>기준 대비</p>
            <p className={"font-bold text-3xl text-green-500"}>{ratio}%</p>
          </div>
          <div className={"bg-sky-100 rounded-lg p-4 h-[88px] text-left"}>
            <p className={"font-bold  text-lg"}>등급</p>
            <p className={"font-bold text-3xl text-sky-600"}>1++</p>
          </div>
        </div>
        <MyEcharts option={barOption} style={{ height: "160px" }} />
      </CardContent>
    </Card>
  );
}

export default EnergyGradeCard;

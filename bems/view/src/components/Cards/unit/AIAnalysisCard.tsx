"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MyEcharts from "@/components/Charts/MyEcharts";
import { createBarOption } from "@/components/Charts/options/Bar";
import { Lightbulb } from "lucide-react";
import { BarExComponent } from "@/components/Charts/unit/barExample";
import { BarMultipleExComponent } from "@/components/Charts/unit/areaLineExample";
import { useQuery } from "@tanstack/react-query";
import { fetchBuildingMonthlyUsage } from "@/components/Cards/unit/EnergyGradeCard";
import formatWithcommas from "@/utils/formatWithcommas";

// hooks/useAIResponse.ts

export interface FilteredAIResponseProps {
  buildingInfo: {
    name: string;
  };
  powerUsage: {
    currentMonth: number; // 당월 전력 사용량
    previousMonth: number; // 전월 전력 사용량
    changeRate: number; // 직전달 대비 비율
    peakDemand: number; // 당월 피크값
  };
  estimatedBill: {
    basicCharge: number;
    usageCharge: number;
    totalEstimate: number; // 총 비용 예측값
  };
  anomalyAlerts: {
    count: number;
    timeRanges: [string, string, string, string, string];
    maxValue: number;
    minValue: number;
  };
  energyIntensity: {
    currentMonth: number;
    previousMonth: number;
    unit: string;
  };
}

interface AIAnalysisCardProps {
  buildingId: number;
}

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ buildingId }) => {
  // todo: 데이터와 화면 연결

  const energyType = "POWER";
  const API_URL = `/api/api/building/${buildingId}/${energyType}/month/today`;
  const { data, error, isLoading } = useQuery<number>({
    queryKey: ["buildingMonthTodayUsage", buildingId],
    queryFn: () => fetchBuildingMonthlyUsage(API_URL),
  });

  const monthUsage = data
    ? formatWithcommas({ value: data, label: "kWh", divider: 1000 })
    : 0;

  // todo: ai 응답 요청 하는 url
  /*
    const API_URL = `/api/ai/generate?building-id=${buildingId}`;

    const { data, error, isLoading } = useQuery<FilteredAIResponseProps>({
      queryKey: ["aiResponse", buildingId], // 쿼리 키
      queryFn: async (): Promise<FilteredAIResponseProps> => {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        return res.json();
      },
      staleTime: Infinity, // 데이터 새로고침 방지
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    */

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const mockData = [
    { name: "기준", value: 150 },
    { name: "작년", value: 120 },
  ];

  // 바 차트 색상 설정
  const barColors = ["#E2E8F0", "#38BDF8"]; // 각 바에 대한 색상

  // 차트 옵션 생성
  const barOption = createBarOption(mockData, { colors: barColors });

  const nowKorean = new Date().toLocaleString();
  return (
    <div className="col-span-1 flex flex-col gap-4 w-full min-w-[424px] basis-0 h-full">
      <Card>
        <CardHeader className="flex-row justify-between items-center px-6 pb-2 w-full">
          <CardTitle className="text-left text-lg font-bold leading-7">
            에너지 사용량 AI 분석
          </CardTitle>
          <CardDescription className=" text-right text-sm font-normal leading-5">
            {nowKorean}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col  bg-[#F1F5F9] pt-4 px-6 gap-2">
          건물 전체 에너지 효율을 분석한 내용입니다.
          <Card className="flex-col px-4 pt-4 pb-1 gap-1 w-full">
            <CardDescription className="flex flex-row gap-0.5 items-center text-left text-sm font-medium">
              <Lightbulb size={"18px"} /> 총 에너지 사용량
            </CardDescription>
            <CardContent className="grid grid-cols-2">
              <MyEcharts option={barOption} style={{ height: "162px" }} />
              <div>
                <div className={"px-1 py-1.5"}>
                  <p className={"text-sm"}>총 에너지 사용량은</p>
                  <p className={"text-green-500 font-bold text-base"}>
                    {monthUsage}
                  </p>
                </div>
                <div className={"px-1 py-1.5"}>
                  <p className={"text-sm"}>동급 건물 대비</p>
                  <p className={"text-sky-600 font-bold text-base"}>
                    15% 낮은 수준
                  </p>
                </div>
                <div className={"px-1 py-1.5"}>
                  <p className={"text-sm"}>동급 건물 대비</p>
                  <p className={"text-sky-500 font-bold text-base"}>
                    512,340원 절약
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-col px-4 pt-4 pb-1 gap-1 w-full">
            <CardDescription className="flex flex-row gap-1 items-center text-left text-sm font-medium">
              <Lightbulb size={"18px"} /> 기간별 에너지 사용량 및 비용
            </CardDescription>
            <CardContent className="flex flex-col px-4 pb-4 pt-2">
              <div className="flex flex-col py-2">
                <p>시간대별 피크 사용량은</p>
                <p>오후 12시~2시 구간에서 발생합니다.</p>
              </div>
              <BarMultipleExComponent />
              <div className="flex flex-col py-2">
                <p>이번달 에너지 총 비용은</p>
                <p>으로 예측 됩니다.</p>
              </div>
              <BarExComponent />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalysisCard;

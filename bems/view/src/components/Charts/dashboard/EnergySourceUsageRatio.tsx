"use client";

import { useMemo, useState } from "react";
import MyEcharts from "@/components/Charts/MyEcharts";
import { useQuery } from "@tanstack/react-query";
import * as echarts from "echarts";
import { Pie } from "@/components/Charts/options/Pie";
import { createBarOption } from "@/components/Charts/options/Bar";

interface ApiResponse {
  buildingName: string;
  value: number;
  updatedTime: number[]; // [year, month, day, hour, minute, second, nanoseconds]
}

interface ChartDataItem {
  name: string;
  value: number;
}

const CHART_TYPES = {
  BAR: "bar",
  CIRCLE: "circle",
} as const;

type ChartType = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];

const useEnergyUsageQuery = () => {
  const energyType = "POWER";
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return useQuery<ApiResponse[], Error>({
    queryKey: ["energyUsageRatio", energyType, year, month],
    queryFn: async () => {
      const response = await fetch(
        `/api/consumption/${energyType}/all/separate?year=${year}&month=${month}`,
      );
      console.log(`EnergySourceUsageRatio request url : ${year}-${month}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};

const EnergySourceUsageRatio = () => {
  const [barOrPie, setBarOrPie] = useState<ChartType>(CHART_TYPES.BAR);
  const {
    data: apiData = [],
    isLoading,
    error,
    refetch,
  } = useEnergyUsageQuery();

  const updatedTime = useMemo(() => {
    if (apiData.length > 0) {
      const [year, month, day, hour, minute] = apiData[0].updatedTime; // 배열 형태로 분리
      return `기준 : ${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
    }
    return null;
  }, [apiData]);

  const singleColor = "#58D9F9";

  const chartData: ChartDataItem[] = apiData
    .filter((item) => item.buildingName !== "하이테크센터")
    .map((item) => ({
      name: item.buildingName,
      value: item.value,
    }));

  const chartOption = useMemo(() => {
    const markLineConfig: echarts.MarkLineComponentOption = {
      data: [
        { type: "max", name: "최대값", lineStyle: { color: "#36A2EB" } },
        { type: "average", name: "평균값", lineStyle: { color: "#A25FFB" } },
        { type: "min", name: "최소값", lineStyle: { color: "#34D399" } },
      ],
      label: { formatter: "{b}: {c}", fontSize: 10, color: "#555" },
    };

    return barOrPie === CHART_TYPES.CIRCLE
      ? Pie(chartData)
      : createBarOption(chartData, {
          colors: singleColor,
          markLine: markLineConfig,
        });
  }, [barOrPie, chartData, singleColor]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          이달의 건물별 에너지 사용량 현황
        </h2>
        {/* 기준 날짜 */}
        <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-700 font-medium shadow-sm">
          {updatedTime || "Loading..."}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={() => setBarOrPie(CHART_TYPES.BAR)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
            barOrPie === CHART_TYPES.BAR
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📊 <span>Bar</span>
        </button>
        <button
          onClick={() => setBarOrPie(CHART_TYPES.CIRCLE)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
            barOrPie === CHART_TYPES.CIRCLE
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🟠 <span>Circle</span>
        </button>
      </div>

      {/* Chart Section */}
      <div className="h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="loader animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">
            데이터를 불러오지 못했습니다.
            <button
              onClick={() => refetch()}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <MyEcharts option={chartOption} style={{ height: "200px" }} />
        )}
      </div>
    </div>
  );
};

export default EnergySourceUsageRatio;

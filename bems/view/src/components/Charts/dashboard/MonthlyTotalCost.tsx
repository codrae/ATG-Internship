"use client";

import React from "react";
import MyEcharts from "@/components/Charts/MyEcharts";
import {
  HorizontalBarData,
  createHorizontalStackedBar,
} from "@/components/Charts/options/HorizontalStackedBar";
import { useQuery } from "@tanstack/react-query";
import formatWithcommas from "@/utils/formatWithcommas";

// 비용 데이터 Fetching 함수
const fetchMonthlyAllCost = async (
  year: number,
  month: number,
  date: number,
): Promise<number> => {
  const response = await fetch(
    `/api/charge/total?year=${year}&month=${month}&date=${date}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch cost data: ${response.statusText}`);
  }
  const data = await response.json();
  return data?.cost ?? 0;
};

// 현재 날짜 반환 함수
const getCurrentDate = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
  };
};

const MonthlyTotalCost: React.FC = () => {
  const { year, month, date } = getCurrentDate();

  // React Query를 사용해 데이터 Fetch
  const {
    data: totalCost,
    error,
    isLoading,
  } = useQuery<number>({
    queryKey: ["monthlyTotalCost", year, month, date],
    queryFn: () => fetchMonthlyAllCost(year, month, date),
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
    : totalCost !== undefined
      ? `${formatWithcommas({ value: totalCost, label: "만원" })}`
      : "데이터 불러오기 실패";

  return (
    <div className="bg-white shadow-lg rounded-md p-4 flex flex-col">
      {/* 상단 텍스트 */}
      <div className="flex flex-col h-14 justify-start">
        <div className="h-7 flex items-center text-slate-950 text-sm font-['Pretendard'] font-bold">
          이달의 총 누적 비용
        </div>
        <div className="flex items-center gap-2 text-slate-950 text-lg font-bold font-['Pretendard']">
          {formattedCost}
          <div className="flex items-center gap-1">
            <span className="text-red-500 text-sm font-bold">4.3% ↑</span>
          </div>
        </div>
      </div>

      {/* 에러 처리 및 차트 렌더링 */}
      {error ? (
        <p className="text-red-500">{`에러 발생: ${error.message}`}</p>
      ) : (
        <MyEcharts
          option={createHorizontalStackedBar(chartData)}
          style={{ width: "400px", height: "100px" }}
        />
      )}
    </div>
  );
};

export default MonthlyTotalCost;

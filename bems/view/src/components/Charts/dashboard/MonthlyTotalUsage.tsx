"use client";

import React, { useState } from "react";
import MyEcharts from "@/components/Charts/MyEcharts";
import Gauge from "@/components/Charts/options/Gauge";
import { useQuery } from "@tanstack/react-query";

// Fetch 함수
const fetchMonthlyUsage = async (url: string): Promise<number> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }
  return res.json();
};

// 숫자를 1,000 단위로 구분하는 함수
const formatNumber = (value: number): string =>
  new Intl.NumberFormat("en-US").format(value);

const MonthlyTotalUsage: React.FC = () => {
  const energyType = "POWER";
  const API_URL = `/api/api/${energyType}/month/today`;

  // 목표값 설정
  const TARGET = 1000000; // 최대값 (1,000,000)

  const [showTooltip, setShowTooltip] = useState(false);

  // 데이터 Fetching
  const { data, error, isLoading } = useQuery<number>({
    queryKey: ["monthTodayUsage", energyType],
    queryFn: () => fetchMonthlyUsage(API_URL),
  });

  // 데이터 처리
  const usageValue = data || 0; // 기본값 0
  const lastYearComparison = "30% 증가"; // 예시 값

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4 relative">
      {/* 타이틀 영역 */}
      <div className="flex justify-between items-center">
        <h2 className="text-slate-950 text-lg font-bold font-['Pretendard'] leading-7">
          이달의 총 누적 사용량
        </h2>
        {/* ? 아이콘 */}
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="w-5 h-5 bg-gray-200 text-slate-800 flex items-center justify-center rounded-full text-sm font-bold">
            ?
          </div>

          {/* 툴팁 */}
          {showTooltip && (
            <div className="absolute top-8 right-0 bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg w-48 z-10">
              <p className="font-semibold mb-1">kWh란?</p>
              <p>
                킬로와트시(kilowatt-hour)를 의미하며, 전력 소비량을 나타내는
                단위입니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="grid grid-cols-2 gap-4 items-center">
        {isLoading ? (
          <p className="text-gray-500 text-sm animate-pulse">
            데이터를 불러오는 중입니다...
          </p>
        ) : error ? (
          <p className="text-red-500 text-sm font-medium">
            데이터를 불러오지 못했습니다: {String(error)}
          </p>
        ) : (
          <>
            {/* Semi-circle Gauge Chart */}
            <div className="flex justify-center">
              <MyEcharts
                option={Gauge(usageValue, TARGET, {
                  fontSize: 16,
                  fontWeight: "bold",
                  offsetCenter: [0, "0%"],
                  rich: {
                    blueText: {
                      color: "#0284C7", // 기본 파란색
                      fontWeight: "bold",
                      fontSize: 16,
                    },
                  },
                  formatter: () => {
                    const percentage = Math.floor(
                      (usageValue * 100) / TARGET,
                    ).toLocaleString();
                    return `설정 목표 대비 \n{blueText|${percentage}% 사용}`;
                  },
                })}
                style={{
                  width: "360px",
                  height: "144px",
                }}
              />
            </div>

            {/* 비교 데이터 영역 */}
            <div className="flex flex-col justify-center space-y-2 border-l pl-4">
              <div className="text-gray-800 text-sm">누적 사용량</div>
              <div className="text-gray-800 text-lg font-bold">
                {formatNumber(usageValue)} kWh
              </div>
              <div className="text-gray-800 text-sm">작년 동월 대비</div>
              <div className="text-red-600 text-base font-bold">
                {lastYearComparison} ↑
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlyTotalUsage;

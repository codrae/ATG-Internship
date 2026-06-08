"use client";

import React, { useState } from "react";
import MyEcharts from "@/components/Charts/MyEcharts";
import { createBarOption } from "@/components/Charts/options/Bar";

const EnergySavingGoalProgress: React.FC = () => {
  // 목업 데이터
  const mockData = [
    { name: "기준", value: 120 },
    { name: "작년", value: 150 },
    { name: "누적", value: 90 },
  ];

  // 바 차트 색상 설정
  const barColors = ["#5EEAD4", "#34D399", "#22D3EE"]; // 각 바에 대한 색상

  // 차트 옵션 생성
  const barOption = createBarOption(mockData, { colors: barColors });

  // 계산 값
  const remainingUsage = 120 - 90; // 잔여 사용량
  const targetAchieved = Math.round((90 / 120) * 100); // 목표 달성률
  const lastYearComparison = "+17.3%"; // 증가율

  // 상태 관리: 툴팁 표시
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 relative">
      {/* 타이틀 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-950 text-lg font-bold">
          에너지 절감 목표 대비 실적 현황
        </div>

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
              <p className="font-semibold mb-1">TOE란?</p>
              <p>
                TOE는 &quot;Tonne of Oil Equivalent&quot;의 약자로, 1톤의 원유가
                내는 에너지를 기준으로 사용량을 표현합니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 바 차트 */}
        <MyEcharts option={barOption} style={{ height: "300px" }} />

        {/* 데이터 요약 */}
        <div className="flex flex-col justify-center space-y-6">
          {/* 잔여 사용량 */}
          <div>
            <div className="text-slate-600 text-sm">잔여 사용량</div>
            <div className="flex justify-between items-center">
              <div className="text-slate-900 text-lg font-bold">
                {remainingUsage} TOE
              </div>
              <div className="text-slate-400">{100 - targetAchieved}%</div>
            </div>
          </div>

          {/* 목표 달성률 */}
          <div>
            <div className="text-slate-600 text-sm">목표 달성률</div>
            <div className="flex justify-between items-center">
              <div className="text-slate-900 text-lg font-bold">
                {targetAchieved}%
              </div>
              <div className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                달성률 {targetAchieved}%
              </div>
            </div>
          </div>

          {/* 전년도 동일월 사용량 */}
          <div>
            <div className="text-slate-600 text-sm">전년도 동일월 사용량</div>
            <div className="flex justify-between items-center">
              <div className="text-slate-900 text-lg font-bold">150 TOE</div>
              <div className="text-red-500 text-sm font-bold">
                {lastYearComparison}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergySavingGoalProgress;

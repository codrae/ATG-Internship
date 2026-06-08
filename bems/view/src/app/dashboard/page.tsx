"use client";

import React from "react";
import EnergySourceUsageRatio from "@/components/Charts/dashboard/EnergySourceUsageRatio";
import EnergySavingGoalProgress from "@/components/Charts/dashboard/EnergySavingGoalProgress";
import MonthlyTotalCost from "@/components/Charts/dashboard/MonthlyTotalCost";
import MonthlyTotalUsage from "@/components/Charts/dashboard/MonthlyTotalUsage";
import EnergyUsageTrend from "@/components/Charts/dashboard/EnergyUseageTrend";
import School from "@/components/DigitalTwin/School";
import AlarmCard from "@/components/Alarm/AlarmCard";

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-6 p-6 pt-2">
      {/* 왼쪽 섹션 */}
      <div className="col-span-1">
        <School />
        <div className="mt-4">
          {/*<AlarmCenter />*/}
          <AlarmCard />
        </div>
      </div>
      {/* 오른쪽 섹션 */}
      <div className="col-span-1 space-y-6">
        {/* 첫 번째 행: 파이/바 차트 */}
        <EnergySourceUsageRatio />
        {/* 세 번째 행: 비용 및 사용량 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <MonthlyTotalUsage />
            <MonthlyTotalCost />
          </div>
          {/* 두 번째 행: 건물별 에너지 사용량 */}
          <EnergySavingGoalProgress />
          {/* 두 번째 행: 라인차트 */}
        </div>
        <EnergyUsageTrend />
      </div>
    </div>
  );
}

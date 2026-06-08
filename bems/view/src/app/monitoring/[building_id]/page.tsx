//src/app/monitoring/[building_id]/page.tsx

"use client";

import React from "react";
import { BuildingEnergyNavigator } from "@/components/layout/BuildingEnergyNavigator";
import AccordianCard from "@/components/Cards/AccordianCard";
import { Card } from "@/components/ui/card";
import TodayUsage from "@/components/Cards/monitoring/TodayUsageCardsContainer";
import TotalEnergyUsageBySourceCard from "@/components/Cards/monitoring/TotalEnergyUsageBySourceCard";
import EnergyUsageStateCard from "@/components/Cards/statistics/EnergyUsageStateCard";
import { ZoomIn } from "lucide-react";

interface BuildingPageProps {
  params: {
    building_id: number;
    energy_type: number;
  };
}

export default function MonitoringPage({ params }: BuildingPageProps) {
  const { building_id, energy_type = 1 } = params;

  const now = new Date();
  const beforeOneWeek = new Date();
  beforeOneWeek.setDate(now.getDate() - 7);

  return (
    <div>
      {/* 건물 네비게이션 바 */}
      <BuildingEnergyNavigator
        icon={<ZoomIn size={"20"} />}
        label="에너지 모니터링"
        currentBuildingId={building_id}
      />

      {/* 건물 이너 헤더 */}
      <AccordianCard building_id={building_id} total_energy={1234} />

      <div className="p-4 bg-gray-40">
        <div className="flex flex-row w-full gap-4">
          <Card className="flex flex-row">
            <TodayUsage building_id={building_id} energy_type={energy_type} />
          </Card>

          {/* 에너지원별 총 사용량 */}
          <TotalEnergyUsageBySourceCard building_id={building_id} />
        </div>

        {/* 에너지 사용량 현황 */}
        <EnergyUsageStateCard
          building_id={building_id}
          start={beforeOneWeek}
          end={now}
        />
      </div>
    </div>
  );
}

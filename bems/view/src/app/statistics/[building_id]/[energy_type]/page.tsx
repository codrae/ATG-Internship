// src/app/statistics/[building_id]/[energy_type]/page.tsx

import React from "react";
import { BuildingEnergyNavigator } from "@/components/layout/BuildingEnergyNavigator";
import AccordianCard from "@/components/Cards/AccordianCard";
import { PeriodEnergyCard } from "@/components/Cards/PeriodEnergyCard";
import { ChartArea } from "lucide-react";
import BuildingEnergyEfficiencyAnalysisCard from "@/components/Cards/statistics/BuildingEnergyEfficiencyAnalysisCard";
import { idToEnergyKorean } from "@/data/buildings";

interface EnergyPageProps {
  params: {
    building_id: number;
    energy_type: number;
  };
}

export default async function EnergySummaryPage({ params }: EnergyPageProps) {
  const { building_id, energy_type } = params;
  const now = new Date();
  const before1Day = new Date();
  before1Day.setDate(now.getDate() - 7);

  return (
    <div>
      <BuildingEnergyNavigator
        icon={<ChartArea size={"20"} />}
        label="에너지 분석"
        currentBuildingId={building_id}
        currentEnergyTypeId={energy_type}
      />

      {/* 건물 이름 및 상태 */}
      <AccordianCard building_id={building_id} total_energy={1234} />

      <div className={"grid grid-cols-4 gap-4 p-6 w-full h-full"}>
        <div className="col-span-3">
          <PeriodEnergyCard
            building_id={building_id}
            energy_type={energy_type}
            label={`${idToEnergyKorean[building_id]} 에너지 사용 현황`}
            startTime={now}
            endTime={before1Day}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-4 w-full min-w-[424px] basis-0 h-full">
          <BuildingEnergyEfficiencyAnalysisCard
            building_id={building_id}
            energy_type={energy_type}
          />
        </div>
      </div>
    </div>
  );
}

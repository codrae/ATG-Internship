// src/app/monitoring/[building_id]/[energy_type]/page.tsx

import React from "react";
import { VarianceChart } from "@/components/Charts/VarienceChart";
import { SourceEnergyCard } from "@/components/Cards/monitoring/SourceEnergyCard";
import { BuildingEnergyNavigator } from "@/components/layout/BuildingEnergyNavigator";
import AccordianCard from "@/components/Cards/AccordianCard";
import { PeriodEnergyCard } from "@/components/Cards/PeriodEnergyCard";
import { ZoomIn } from "lucide-react";
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
  const beforeOneWeek = new Date();
  beforeOneWeek.setDate(now.getDate() - 7);

  return (
    <div>
      <BuildingEnergyNavigator
        icon={<ZoomIn size={"20"} />}
        label={"에너지원 모니터링 / 에너지원별"}
        currentBuildingId={building_id}
        currentEnergyTypeId={energy_type}
      />

      {/* 건물 이름 및 상태 */}
      <AccordianCard building_id={building_id} total_energy={1234} />

      <div className={"grid grid-cols-4 gap-4 p-6 h-full"}>
        <div className="col-span-3 h-full">
          <PeriodEnergyCard
            building_id={building_id}
            energy_type={energy_type}
            label={`${idToEnergyKorean[energy_type]} 에너지 사용 현황`}
            typeOfButton={"hour"}
            showPredictData={true}
            startTime={beforeOneWeek}
            endTime={now}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-4 w-full h-full">
          <VarianceChart />
          <SourceEnergyCard />
        </div>
      </div>
    </div>
  );
}

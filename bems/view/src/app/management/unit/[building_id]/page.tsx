// src/app/management/unit/[building_id]/page.tsx

import React from "react";
import { BuildingEnergyNavigator } from "@/components/layout/BuildingEnergyNavigator";
import { ChartArea } from "lucide-react";
import UnitPageWrapper from "@/components/Cards/unit/UnitPageWrapper";

interface EnergyPageProps {
  params: {
    building_id: number;
    energy_type: number;
  };
}

export default async function EnergySummaryPage({ params }: EnergyPageProps) {
  const { building_id, energy_type = 1 } = params;

  // 초기값 당월 1일 ~말일
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return (
    <div>
      <BuildingEnergyNavigator
        icon={<ChartArea size={"20"} />}
        label="지표관리 / 원단위"
        currentBuildingId={1}
        // currentEnergyTypeId={1}
      />
      <UnitPageWrapper
        buildingId={building_id}
        energyTypeId={energy_type}
        start={start}
        end={end}
      />
    </div>
  );
}

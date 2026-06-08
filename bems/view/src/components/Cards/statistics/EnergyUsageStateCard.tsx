// 에너지 모니터링 - 전체 에너지 페이지 - 에너지 사용량 현황 카드

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnergyStatusButton } from "@/components/Buttons/EnergyStatusButton";
import { Zap } from "lucide-react";
import { PeriodEnergyCard } from "@/components/Cards/PeriodEnergyCard";
import { useState } from "react";

interface CardProps {
  building_id: number;
  start?: Date;
  end?: Date;
}

function EnergyUsageStateCard({ building_id, start, end }: CardProps) {
  const [selectedEnergyType, setSelectedEnergyType] = useState<number>(1);

  const handleEnergyTypeChange = (energyType: number) => {
    setSelectedEnergyType(energyType);
  };

  const energyData = [
    { energyTypeId: 0, label: "전체", icon: null },
    {
      energyTypeId: 1,
      label: "전기",
      icon: <Zap />,
      color: "text-amber-500 bg-amber-100",
    },
    {
      energyTypeId: 2,
      label: "열",
      icon: <Zap />,
      color: "text-rose-500 bg-rose-100",
    },
    {
      energyTypeId: 3,
      label: "가스",
      icon: <Zap />,
      color: "text-[#727EF8] bg-[#BFC5FF]",
    },
  ];

  const selectedEnergyData = energyData.find(
    (item) => selectedEnergyType === item.energyTypeId,
  );

  return (
    <Card className="flex flex-col w-full my-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold">에너지 사용량 현황</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row gap-4">
        <div className="grid grid-rows-6 grid-flow-col gap-4 p-4 bg-slate-50 w-full max-w-[300px]">
          {energyData.map((button) => (
            <EnergyStatusButton
              key={button.energyTypeId}
              buildingId={building_id}
              energyTypeId={button.energyTypeId}
              label={button.label}
              icon={button.icon}
              onClick={() => handleEnergyTypeChange(button.energyTypeId)}
              isTotal={button.energyTypeId === 0}
              isAlert={button.label !== "전기"}
              labelColor={
                selectedEnergyType === button.energyTypeId
                  ? button.color
                  : "bg-white text-gray-700"
              }
            />
          ))}
        </div>
        <PeriodEnergyCard
          building_id={building_id}
          energy_type={selectedEnergyType === 0 ? 1 : selectedEnergyType}
          label={
            <>
              {selectedEnergyData?.icon} {selectedEnergyData?.label} 에너지
            </>
          }
          isTable={false}
          className={"flex flex-col w-full shadow-none border-none"}
          startTime={start}
          endTime={end}
        />
      </CardContent>
    </Card>
  );
}

export default EnergyUsageStateCard;

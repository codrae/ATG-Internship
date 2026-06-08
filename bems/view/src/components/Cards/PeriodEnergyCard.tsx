/*
    조회 기간 드롭다운 버튼과 에너지 raw 데이터 차트를 포함한 카드
 */

"use client";

import { PeriodButton } from "@/components/Buttons/PeriodButton";
import EnergyChart from "@/components/Charts/EnergyChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, RefreshCcw } from "lucide-react";
import { CustomButton } from "@/components/Buttons/BasicButton";
import AlarmTable from "@/components/Table/Table";
import React, { useEffect } from "react";
import { periodAtom } from "@/atoms/periodAtom";
import { useAtom } from "jotai";

interface PeriodEnergyCardProps {
  building_id: number;
  energy_type: number;
  label?: React.ReactNode;
  isTable?: boolean;
  showPredictData?: boolean;
  isRetrainButton?: boolean;
  isPeriodButton?: boolean; // 기간 버튼 숨김 옵션 추가
  typeOfButton?: "hour" | "customPeriod" | "week" | "month" | "quarter";
  className?: string;
  startTime?: Date;
  endTime?: Date;
}

// eslint-disable-next-line react/display-name
export const PeriodEnergyCard = React.forwardRef<
  HTMLDivElement,
  PeriodEnergyCardProps
>(
  (
    {
      building_id,
      energy_type,
      label,
      isTable = true,
      showPredictData = false,
      isRetrainButton = true,
      isPeriodButton = true, // 기본값 true
      typeOfButton = "hour",
      className,
      startTime,
      endTime,
    },
    ref,
  ) => {
    const [period, setPeriod] = useAtom(periodAtom);

    // 입력값으로 startTime과 endTime이 들어온 경우 초기값 설정
    useEffect(() => {
      if (startTime && endTime) {
        setPeriod({ start: startTime, end: endTime });
      }
    }, [startTime, endTime, setPeriod]);

    console.log(
      "PeriodEnergyCard의 Atom 상태:: ",
      period.start,
      period.end,
      startTime,
      endTime,
    );

    return (
      <Card ref={ref} className={className}>
        <CardHeader className="flex-col items-start px-6 pb-2 w-full">
          <div className="flex flex-row items-center justify-between w-full">
            {/* 카드 제목 */}
            <CardTitle className="flex flex-row gap-1 text-lg font-bold">
              {label}
            </CardTitle>
            <Info />
          </div>
          <div className="flex flex-row gap-4">
            {/* 기간 선택 드롭다운 버튼 */}
            {isPeriodButton && (
              <PeriodButton
                currentBuildingId={building_id}
                energyType={energy_type}
                onPeriodChange={(start, end) => setPeriod({ start, end })}
                typeOfButton={typeOfButton}
                startTime={period.start}
                endTime={period.end}
              />
            )}
            {isRetrainButton && (
              <CustomButton
                text={"재학습"}
                icon={<RefreshCcw />}
                iconPosition={"left"}
              />
            )}
          </div>
        </CardHeader>

        {/* 에너지원 선 그래프 */}
        <CardContent className="px-4 pb-2">
          <EnergyChart
            building_ids={[building_id]}
            energy_ids={[energy_type]}
            startTime={period.start}
            endTime={period.end}
            showPredictData={showPredictData}
          />
        </CardContent>

        {isTable && (
          <>
            <CardHeader className="flex-row justify-between items-center px-6 pb-2 w-full">
              <CardTitle className="text-left text-lg font-bold leading-7">
                알림 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AlarmTable building_id={building_id} />
            </CardContent>
          </>
        )}
      </Card>
    );
  },
);

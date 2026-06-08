/*
  지표관리-원단위 페이지에서 건물 네비게이터를 제외한 서브헤더와 내부 레이아웃을 관리하는 컴포넌트
 */

"use client";

import { PeriodEnergyCard } from "@/components/Cards/PeriodEnergyCard";
import TableCard from "@/components/Table/TableCard";
import EnergyGradeCard from "@/components/Cards/unit/EnergyGradeCard";
import React, { useEffect, useState } from "react";
import { BuildingProps } from "@/types";
import DatePickerHeader from "@/components/Cards/unit/DatePickerHeader";
import { useAtom } from "jotai";
import { periodAtom } from "@/atoms/periodAtom";
import AIAnalysisCard from "@/components/Cards/unit/AIAnalysisCard";
import Card from "antd/lib/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Fuel, Zap } from "lucide-react";
import { PieExComponent } from "@/components/Charts/unit/pieExChart";

interface UnitPageWrapperProps extends BuildingProps {
  start: Date;
  end: Date;
}

export default function UnitPageWrapper({
  buildingId,
  energyTypeId,
  start,
  end,
}: UnitPageWrapperProps) {
  // const now = new Date();

  const [isMonthOrYear, setIsMonthOrYear] = useState<string>("month");
  const [period, setPeriod] = useAtom(periodAtom);

  useEffect(() => {
    if (start && end) {
      setPeriod({ start, end });
    }
  }, [start, end, setPeriod]);

  return (
    <div className={"w-full h-full"}>
      {/* 건물 이름 및 년/월 선택 */}
      <DatePickerHeader
        buildingId={buildingId}
        energyTypeId={energyTypeId}
        isCalendar={true}
        selectedMonthOrYear={(type) => setIsMonthOrYear(type)}
      />
      <div className="grid grid-cols-4 gap-4 p-6 ">
        <div className="col-span-3 flex flex-col gap-4">
          <div className={"flex flex-row gap-4"}>
            <Card>
              <CardHeader className="flex-col px-6 pb-2 gap-1 w-full">
                <CardTitle className="text-left text-lg font-bold leading-7">
                  에너지원별 원단위 비중
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PieExComponent />
                <div className={"bg-slate-50 rounded-lg w-[252px] px-6 py-4"}>
                  <div className={"flex flex-row items-center justify-between"}>
                    <p
                      className={
                        "flex flex-row items-center text-amber-300 text-base font-700"
                      }
                    >
                      <Zap size={"16px"} /> 전기
                    </p>
                    <p className={"text-sm font-500 text-[#6B7280]"}>192 TOE</p>
                    <p className={"text-base font-700"}> 60%</p>
                  </div>
                  <div className={"flex flex-row items-center justify-between"}>
                    <p
                      className={
                        "flex flex-row text-rose-500 text-base font-700"
                      }
                    >
                      <Flame size={"16px"} /> 열{" "}
                    </p>
                    <p className={"text-sm font-500 text-[#6B7280]"}>96 TOE</p>
                    <p className={"text-base font-700"}> 30%</p>
                  </div>
                  <div className={"flex flex-row items-center justify-between"}>
                    <p
                      className={
                        "flex flex-row text-indigo-500 text-base font-700"
                      }
                    >
                      <Fuel size={"16px"} /> 가스{" "}
                    </p>
                    <p className={"text-sm font-500 text-[#6B7280]"}>32 TOE</p>
                    <p> 10%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <PeriodEnergyCard
              building_id={buildingId}
              energy_type={energyTypeId}
              label={"에너지 일간 원단위"}
              className={"w-full"}
              isTable={false}
              isRetrainButton={false}
              typeOfButton={isMonthOrYear === "year" ? "quarter" : "week"}
              startTime={period.start}
              endTime={period.end}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 ">
            <TableCard building_id={buildingId} />
            <EnergyGradeCard building_id={buildingId} />
          </div>
        </div>
        <AIAnalysisCard buildingId={buildingId} />
      </div>
    </div>
  );
}

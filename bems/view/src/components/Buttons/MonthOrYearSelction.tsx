"use client";

import { CustomButton } from "@/components/Buttons/BasicButton";
import { useEffect, useState } from "react";
import CustomDatePicker from "@/components/DatePicker";
import { BuildingProps } from "@/types";
import { periodAtom } from "@/atoms/periodAtom";
import { useAtom } from "jotai";

interface MonthOrYearSelctionProps extends BuildingProps {
  selectedMonthOrYear?: (type: string) => void;
}

function MonthOrYearSelction({
  buildingId,
  energyTypeId,
  selectedMonthOrYear,
}: MonthOrYearSelctionProps) {
  const [currentSelected, setCurrentSelected] = useState<string>("month");
  const [, setPeriod] = useAtom(periodAtom);

  const handleMonth = () => {
    setCurrentSelected("month");
  };

  const handleYear = () => {
    setCurrentSelected("year");
  };

  // 이번달 버튼
  const handleThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0,
      23,
      59,
      59,
    );
    setPeriod({ start, end });
  };

  useEffect(() => {
    selectedMonthOrYear?.(currentSelected);
  }, [currentSelected, selectedMonthOrYear]);

  return (
    <div className="flex flex-row gap-2">
      {/* 월/년 선택 버튼 */}
      <CustomButton
        text={"월"}
        onClick={handleMonth}
        className={`w-[60px] ${currentSelected === "month" ? "bg-sky-100 text-blue-400 border border-sky-400" : "bg-white text-gray-700 border border-gray-700"}`}
      />
      <CustomButton
        text={"년"}
        onClick={handleYear}
        className={`w-[60px] ${currentSelected === "year" ? "bg-sky-100 text-blue-400 border border-sky-400" : "bg-white text-gray-700 border border-gray-700"}`}
      />

      {/*  Date Picker */}
      <CustomDatePicker
        buildingId={buildingId}
        energyTypeId={energyTypeId}
        type={currentSelected === "month" ? "month" : "year"}
      />

      <CustomButton text={"이번달"} onClick={handleThisMonth} />
    </div>
  );
}

export default MonthOrYearSelction;

/*
  지표 관리 -원단위 / 목표 관리 페이지의 서브 헤더 입니다
 */

"use client";

import { BuildingId, urlToBuildingKorean } from "@/data/buildings";
import { BuildingProps } from "@/types";
import { BuildingButton } from "@/components/Buttons/BuildingButton";
import { CustomButton } from "@/components/Buttons/BasicButton";
import { Download } from "lucide-react";
import StandardYearSelection from "@/components/Buttons/StandardYearSelection";
import MonthOrYearSelction from "@/components/Buttons/MonthOrYearSelction";

interface DatePickerHeaderProps extends BuildingProps {
  isCalendar: boolean;
  selectedMonthOrYear: (type: string) => void;
}

function DatePickerHeader({
  buildingId,
  energyTypeId,
  isCalendar = true,
  selectedMonthOrYear,
}: DatePickerHeaderProps) {
  const building_name = BuildingId[buildingId];

  return (
    <div className={`flex flex-col w-full px-6 pt-8 bg-white pb-8`}>
      <div className="flex flex-row justify-between items-center ">
        {/*건물 이름*/}
        <div className="flex items-center gap-36">
          <p
            className="px-4 text-[40px] font-semibold text-gray-700"
            style={{ textAlign: "left" }}
          >
            {urlToBuildingKorean[building_name]}
          </p>

          {/* 월/년 선택 옵션 */}
          {isCalendar ? (
            <MonthOrYearSelction
              buildingId={buildingId}
              energyTypeId={energyTypeId}
              selectedMonthOrYear={selectedMonthOrYear}
            />
          ) : null}

          {/* 기준년도 선택 드롭다운 */}
          <StandardYearSelection
            building_id={buildingId}
            userSelectedYear={2024}
          />

          {/* 건물 정보 & 다운로드 버튼*/}
          <div className="flex space-x-4">
            <BuildingButton building_id={buildingId} />
            <CustomButton
              text="다운로드"
              icon={<Download />}
              iconPosition="left"
              className="text-gray-100 bg-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatePickerHeader;

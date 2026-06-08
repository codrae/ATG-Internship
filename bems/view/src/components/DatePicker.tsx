"use client";

import React, { useCallback } from "react";
import type { DatePickerProps } from "antd/es/date-picker";
import { ConfigProvider, DatePicker } from "antd";
import koKR from "antd/locale/ko_KR";
import dayjs, { Dayjs } from "dayjs";
import { BuildingId, EnergyTypeId } from "@/data/buildings";
import { periodAtom } from "@/atoms/periodAtom";
import { useAtom } from "jotai";

interface CustomDatePickerProps {
  buildingId: number;
  energyTypeId: number;
  type: "week" | "month" | "year";
}

function CustomDatePicker({
  buildingId,
  energyTypeId,
  type,
}: CustomDatePickerProps) {
  const [period, setPeriod] = useAtom(periodAtom);

  const onChange: DatePickerProps["onChange"] = useCallback(
    async (date: Dayjs) => {
      if (!date) return;
      const start = date.startOf(type).toDate();
      const end = date.endOf("month").toDate();
      console.log("onMonthChange 기간 변경", date);
      console.log("onMonthChange의 startDate와 endDate", start, end);

      console.log(
        "Datepicker의 파라미터와 Atom 상태: ",
        BuildingId[buildingId],
        EnergyTypeId[energyTypeId],
        period,
      );

      setPeriod({ start, end });
    },
    [type, buildingId, energyTypeId, period, setPeriod],
  );

  return (
    <ConfigProvider locale={koKR}>
      <DatePicker
        onChange={onChange}
        picker={type}
        className={"p-1.5 w-[300px]"}
        placeholder={"선택하세요"}
        format={type === "month" ? "YYYY년 MM월" : "YYYY년"}
        defaultValue={dayjs(period.start)}
      />
    </ConfigProvider>
  );
}

export default CustomDatePicker;

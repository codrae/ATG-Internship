"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { DatePickerWithRange } from "@/components/Buttons/DateRangePicker";

interface PeriodButtonProps {
  currentBuildingId: number;
  energyType: number;
  onPeriodChange?: (startTime: Date, endTime: Date) => void;
  typeOfButton: "hour" | "customPeriod" | "week" | "month" | "quarter";
  startTime: Date;
  endTime: Date;
}

export const PeriodButton: React.FC<PeriodButtonProps> = ({
  onPeriodChange,
  typeOfButton,
  startTime,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>("7d");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    typeOfButton === "week"
      ? "aMonth"
      : typeOfButton === "month"
        ? "aYear"
        : "",
  );

  useEffect(() => {
    if (!selectedTime && typeOfButton === "hour") {
      setSelectedTime("7d");
    }
  }, [selectedTime, typeOfButton]);

  useEffect(() => {
    if (
      !selectedPeriod &&
      (typeOfButton === "week" || typeOfButton === "quarter")
    ) {
      setSelectedPeriod("aMonth");
    }
  }, [selectedPeriod, typeOfButton]);

  // Helper 함수: 해당 월의 마지막 날
  const getEndOfMonth = (date: Date): Date => {
    // 다음달 0일은 이번달 마지막날
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
  };

  // Helper 함수: 해당 년의 마지막 날(12월 31일)
  const getEndOfYear = (date: Date): Date => {
    return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  };

  const getYearAndMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
  };

  const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  const addMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date.getTime());
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  const calculateHour = (period: string): Date => {
    // "hour" 등 시간 기준인 경우 now 기반 계산 유지
    const now = new Date();
    switch (period) {
      case "10min":
        now.setMinutes(now.getMinutes() - 10);
        return now;
      case "30min":
        now.setMinutes(now.getMinutes() - 30);
        return now;
      case "1h":
        now.setHours(now.getHours() - 1);
        return now;
      case "3h":
        now.setHours(now.getHours() - 3);
        return now;
      case "6h":
        now.setHours(now.getHours() - 6);
        return now;
      case "12h":
        now.setHours(now.getHours() - 12);
        return now;
      case "1d":
        now.setDate(now.getDate() - 1);
        return now;

      case "7d":
        now.setDate(now.getDate() - 7);
        return now;

      default:
        return new Date(now.setDate(now.getDate() - 1)); // starttime
    }
  };

  const calculateWeekPeriod = (
    period: string,
    baseDate: Date,
  ): [Date, Date] => {
    const startOfMonth = getYearAndMonth(baseDate);

    if (typeOfButton === "week") {
      switch (period) {
        case "aMonth":
          // 한 달 전체 기간
          return [startOfMonth, getEndOfMonth(startOfMonth)];

        case "1week":
          return [startOfMonth, addDays(startOfMonth, 7)]; // 첫째주 : start ~ start+7일

        case "2week":
          return [addDays(startOfMonth, 7), addDays(startOfMonth, 14)]; // 둘째주 : start+7일 ~ start+14일

        case "3week":
          return [addDays(startOfMonth, 14), addDays(startOfMonth, 21)]; // 셋째주 : start+14일 ~ start+21일

        case "4week":
          return [addDays(startOfMonth, 21), getEndOfMonth(startOfMonth)]; // 넷째주 : start+21일 ~ start+28일

        default:
          return [startOfMonth, getEndOfMonth(startOfMonth)];
      }
    }

    return [startOfMonth, getEndOfMonth(startOfMonth)];
  };

  const calculateQuarterPeriod = (
    period: string,
    baseDate: Date,
  ): [Date, Date] => {
    // baseDate는 해당 연도의 시작일
    const startOfYear = new Date(baseDate.getFullYear(), 0, 1, 0, 0, 0);
    switch (period) {
      case "aYear":
        return [startOfYear, getEndOfYear(startOfYear)];

      case "1quarter":
        return [startOfYear, addMonths(startOfYear, 3)];

      case "2quarter":
        return [addMonths(startOfYear, 3), addMonths(startOfYear, 6)];

      case "3quarter":
        return [addMonths(startOfYear, 6), addMonths(startOfYear, 9)];

      case "4quarter":
        return [addMonths(startOfYear, 9), getEndOfYear(startOfYear)];

      default:
        return [startOfYear, getEndOfYear(startOfYear)];
    }
  };

  const handleTimeChange = (period: string) => {
    setSelectedTime(period);

    const startDate = calculateHour(period);
    const now = new Date();
    console.log("handleTimeChange triggered", startDate, now);
    onPeriodChange?.(startDate, now);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);

    let startDate = new Date(startTime);
    let endDate = new Date(startTime);

    if (typeOfButton === "week") {
      [startDate, endDate] = calculateWeekPeriod(period, startDate);
    } else if (typeOfButton === "quarter") {
      [startDate, endDate] = calculateQuarterPeriod(period, startDate);
    }

    console.log("handlePeriodChange triggered", startDate, endDate);
    console.log(
      "handlePeriodChange triggered and selectedTime is : ",
      selectedPeriod,
    );

    onPeriodChange?.(startDate, endDate);
  };

  const renderSelcetItems = () => {
    switch (typeOfButton) {
      case "hour":
        return (
          <>
            <SelectItem value="10min">10분</SelectItem>
            <SelectItem value="30min">30분</SelectItem>
            <SelectItem value="1h">1시간</SelectItem>
            <SelectItem value="3h">3시간</SelectItem>
            <SelectItem value="6h">6시간</SelectItem>
            <SelectItem value="12h">12시간</SelectItem>
            <SelectItem value="1d">1일</SelectItem>
            <SelectItem value="7d">7일</SelectItem>
          </>
        );
      case "week":
        // 주단위: 선택한 월 기준으로 1달 전체(aMonth), 1주~4주
        return (
          <>
            <SelectItem value="aMonth">전체 1개월</SelectItem>
            <SelectItem value="1week">1주</SelectItem>
            <SelectItem value="2week">2주</SelectItem>
            <SelectItem value="3week">3주</SelectItem>
            <SelectItem value="4week">4주</SelectItem>
          </>
        );
      case "quarter":
        // 분기단위: 선택한 년도 기준으로 1년 전체(aYear), 1~4분기
        return (
          <>
            <SelectItem value="aYear">전체 1년</SelectItem>
            <SelectItem value="1quarter">1분기</SelectItem>
            <SelectItem value="2quarter">2분기</SelectItem>
            <SelectItem value="3quarter">3분기</SelectItem>
            <SelectItem value="4quarter">4분기</SelectItem>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {typeOfButton !== "customPeriod" ? (
        <Select
          onValueChange={
            typeOfButton !== "hour" ? handlePeriodChange : handleTimeChange
          }
          value={typeOfButton !== "hour" ? selectedPeriod : selectedTime}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="기간" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Period</SelectLabel>
              {renderSelcetItems()}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <DatePickerWithRange />
      )}
    </>
  );
};

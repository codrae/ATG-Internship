"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getBuildingNumberByKoreanName } from "@/data/buildings";

export interface FilteredAnomalyItem {
  buildingName: string; // 건물 이름
  value: number; // 측정된 값
  createdAt: [number, number, number, number?, number?, number?]; // 튜플 타입으로 선언
  predict: number; // 예측 값
}

const AlarmDropdown: React.FC = () => {
  const API_URL = `/api/anomaly/total?count=5`;

  const {
    data = [],
    error,
    isLoading,
  } = useQuery<FilteredAnomalyItem[]>({
    queryKey: ["anomalyData"],
    queryFn: async (): Promise<FilteredAnomalyItem[]> => {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }
      return res.json();
    },
    refetchInterval: 60000, // Optional: 매 60초마다 데이터 갱신
  });

  // 로딩 상태 처리
  if (isLoading) {
    return <div className="flex items-center">Loading...</div>;
  }

  // 에러 상태 처리
  if (error) {
    return <div className="flex items-center">Error loading data</div>;
  }

  // 가장 최근의 알람 가져오기
  const mostRecentAlarm = data[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        {mostRecentAlarm ? (
          <div className="flex items-center space-x-2 whitespace-nowrap overflow-hidden bg-gray-300 rounded-lg p-2">
            <span className="text-red-500 text-xl flex-shrink-0">❗</span>
            <span className="font-bold flex-shrink-0">
              {mostRecentAlarm.buildingName}
            </span>
            <span className="text-sm text-gray-600 flex-shrink-0">
              {mostRecentAlarm.value}(실제값) → {mostRecentAlarm.predict}
              (예측값)
            </span>
            <span className="text-xs text-gray-500">
              {mostRecentAlarm.createdAt
                ? new Date(...mostRecentAlarm.createdAt).toLocaleString(
                    "ko-KR",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    },
                  )
                : "날짜 정보 없음"}
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-red-500 text-xl">❗</span>
            <span className="ml-2">알림이 없습니다</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2">
        <div className="px-2 py-1 text-gray-700 font-semibold">최근 알림</div>
        {data.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              href={
                getBuildingNumberByKoreanName(item.buildingName)
                  ? `/monitoring/${getBuildingNumberByKoreanName(item.buildingName)}`
                  : "#"
              }
              className="w-full"
            >
              <div className="flex flex-col px-2 py-1">
                <div className="flex justify-between text-sm font-medium text-gray-800">
                  <span>{item.buildingName}</span>
                  <span>
                    {item.createdAt
                      ? new Date(...item.createdAt).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                      : "날짜 정보 없음"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.value}(실제값) → {item.predict}(예측값)
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <div className="w-full flex justify-end">
            <Link
              href="/alerts"
              className="text-blue-500 hover:underline font-medium"
            >
              전체 알림 보기
            </Link>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlarmDropdown;

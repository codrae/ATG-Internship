"use client";

import { BsFillExclamationCircleFill } from "react-icons/bs";
import Link from "next/link";
import { useAnomalyData } from "@/hooks/useTotalAlarm";

export interface FilteredAnomalyItem {
  buildingName: string; // 건물 이름
  value: number; // 측정된 값
  createdAt: string; // 생성된 시간
  predict: number; // 예측 값
}

const AlarmCard = () => {
  const { data = [], error, isLoading } = useAnomalyData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg font-semibold">
          <h1>Error</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">알람 게시판</h3>
        <Link href="/alerts" className="text-blue-500 hover:underline">
          전체보기
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.slice(0, 3).map((item: FilteredAnomalyItem, index: number) => (
          <div
            key={index}
            className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow bg-gray-50 flex flex-col"
          >
            {/* 오류 아이콘 및 상태 */}
            <div className="flex justify-between items-center mb-4 gap-1">
              {/* 왼쪽 아이콘과 텍스트 */}
              <div className="flex items-center">
                <BsFillExclamationCircleFill className="text-red-500 text-sm mr-1" />
                <span className="text-slate-950 text-sm font-medium font-['Pretendard'] leading-tight">
                  오류 발생
                </span>
              </div>
              {/* 오른쪽 생성 시간 */}
              <div className="text-gray-600 text-xs font-normal font-['Pretendard'] leading-none">
                {/*{new Date(item.createdAt).toLocaleString("ko-KR", {*/}
                {/*  year: "numeric",*/}
                {/*  month: "2-digit",*/}
                {/*  day: "2-digit",*/}
                {/*  hour: "2-digit",*/}
                {/*  minute: "2-digit",*/}
                {/*})}*/}
                2024.12.06 12:00 기준
              </div>
            </div>

            {/* 건물 이름 */}
            <h4 className="text-xl font-bold text-center text-gray-800 mb-2">
              {item.buildingName}
            </h4>

            {/* 측정값과 예측값 */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {item.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">실제값</div>
              </div>
              <div className="text-gray-400 mx-2 text-xl">→</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {item.predict}
                </div>
                <div className="text-sm text-gray-500 mt-1">예측값</div>
              </div>
            </div>

            {/* 차이 표시
            <div className="text-center mb-4">
              <div className="text-sm text-gray-600">
                차이:{" "}
                <span className="text-lg font-bold text-red-500">
                  {Math.abs(item.value - item.predict).toFixed(2)}
                </span>
              </div>
            </div>
            <button className="mt-auto w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              자세히 보기
            </button>*/}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlarmCard;

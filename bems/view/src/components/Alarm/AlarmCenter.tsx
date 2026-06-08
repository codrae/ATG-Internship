"use client";

import Link from "next/link";
import { useAnomalyData } from "@/hooks/useTotalAlarm";

export interface FilteredAnomalyItem {
  buildingName: string; // 건물 이름
  value: number; // 측정된 값
  createdAt: string; // 생성된 시간
  predict: number; // 예측 값
}

export default function AnomalyPage() {
  const { data = [], error, isLoading } = useAnomalyData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg font-semibold">
          <h1>Error</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <div className="justify-between flex">
        <h3 className="text-xl font-bold mb-6 text-center">알람 게시판</h3>
        <Link href="/alerts"> 전체보기 </Link>
      </div>

      <table className="table-auto w-full text-left border shadow-lg">
        <thead className="text-black">
          <tr>
            <th className="px-4 py-3">Building Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">Predict</th>
            <th className="px-4 py-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: FilteredAnomalyItem, index: number) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } hover:bg-gray-200`}
            >
              <td className="border px-4 py-2 text-black">
                {item.buildingName || "Unknown"}
              </td>
              <td className="border px-4 py-2 text-center font-semibold bg-red-300 text-red-600">
                Warning!
              </td>
              <td className="border px-4 py-2 text-right text-black">
                {item.value}
              </td>
              <td className="border px-4 py-2 text-center text-black">
                {item.predict}
              </td>
              <td className="border px-4 py-2 text-black">
                {new Date(item.createdAt).toLocaleTimeString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

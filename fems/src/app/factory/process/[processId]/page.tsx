"use client";

import React from "react";
import { useParams } from "next/navigation";
import SensorStatus from "@/components/sensor/SensorStatus";

const mockEquipments = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `설비 ${i + 1}`,
  status: i % 3 === 0 ? "양호" : i % 3 === 1 ? "경고" : "알람",
}));

const EquipmentGrid = () => {
  const params = useParams();
  const processId = params?.processId;

  if (!processId) {
    return <p>프로세스 ID를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* 공정 상태 표시 */}

      <h1 className="text-2xl font-bold mb-6 text-center">
        공정 {processId} 모니터링 페이지
      </h1>

      {/* FactoryStateComponent의 스타일 개선 */}
      <div className="w-full max-w-5xl mb-8"></div>

      {/* 설비 상태 표시 */}
      <div className="grid grid-cols-4 gap-4 w-full max-w-4xl mt-4">
        {mockEquipments.map((equipment) => (
          <div
            key={equipment.id}
            className={`p-4 rounded-lg shadow-md border ${
              equipment.status === "양호"
                ? "bg-green-50 border-green-500"
                : equipment.status === "경고"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-red-50 border-red-500"
            } hover:shadow-lg transition`}
          >
            <h2 className="text-lg font-bold mb-4 text-center">
              {equipment.name}
            </h2>
            {/* SensorStatus 컴포넌트를 사용 */}
            <SensorStatus
              processId={Number(processId)}
              sensorId={equipment.id}
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() =>
                  (window.location.href = `/factory/process/${processId}/${equipment.id}/trends`)
                }
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
              >
                trends
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/factory/process/${processId}/${equipment.id}/fft`)
                }
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition"
              >
                FFT 보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentGrid;

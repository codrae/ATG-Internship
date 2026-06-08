// src/components/RecentAlertLogComponent.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface AlertLogProps {
  logs: string[];
}

const RecentAlertLogComponent: React.FC<AlertLogProps> = ({ logs }) => {
  const router = useRouter();

  const handleViewAll = () => {
    router.push("/alerts"); // /alerts 경로로 이동
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-red-300 w-[350px]">
      <h2 className="font-bold text-lg text-red-600">최근 알림 log</h2>
      <ul className="text-sm text-gray-700">
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
      <button
        onClick={handleViewAll}
        className="mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
      >
        전체 보기
      </button>
    </div>
  );
};

export default RecentAlertLogComponent;

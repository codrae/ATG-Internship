// src/components/OverallStatusComponent.tsx
import React from "react";

interface OverallStatusProps {
  total: number;
  good: number;
  bad: number;
  warning: number;
}

const OverallStatusComponent: React.FC<OverallStatusProps> = ({
  total,
  good,
  bad,
  warning,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 w-[350px]">
      <h2 className="font-bold text-lg">Factory 종합 현황</h2>
      <p>Total: {total}</p>
      <p className="text-green-600">Good: {good}</p>
      <p className="text-red-600">Bad: {bad}</p>
      <p className="text-yellow-500">Warning: {warning}</p>
    </div>
  );
};

export default OverallStatusComponent;

import React from "react";
import Link from "next/link";

interface FactoryStateProps {
  name: string;
  processId: number;
  total: number;
  good: number;
  bad: number;
  warning: number;
}

const FactoryStateComponent: React.FC<FactoryStateProps> = ({
  name,
  processId,
  total,
  good,
  bad,
  warning,
}) => {
  return (
    <div
      className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-md rounded-md p-4 w-[160px] border border-gray-300
    hover:shadow-lg transition-shadow duration-300 opacity-60"
    >
      <h3 className="text-md font-bold text-gray-800 mb-3 text-center">
        {name}
      </h3>
      <div className="text-xs space-y-1 mb-4">
        <p>
          <span className="font-medium text-gray-600">Total:</span> {total}
        </p>
        <p>
          <span className="font-medium text-green-500">Good:</span> {good}
        </p>
        <p>
          <span className="font-medium text-red-500">Bad:</span> {bad}
        </p>
        <p>
          <span className="font-medium text-yellow-500">Warning:</span>{" "}
          {warning}
        </p>
      </div>
      <div className="flex flex-col space-y-2">
        <Link
          href={`/factory/process/${processId}`}
          className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded text-center shadow transition-all text-sm"
        >
          Mornitoring
        </Link>
        <Link
          href={`/factory/process/${processId}/reports`}
          className="px-3 py-1 text-white bg-gray-600 hover:bg-gray-700 rounded text-center shadow transition-all text-sm"
        >
          Report
        </Link>
      </div>
    </div>
  );
};

export default FactoryStateComponent;

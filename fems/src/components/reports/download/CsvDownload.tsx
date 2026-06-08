"use client";

import React from "react";
import { saveAs } from "file-saver";
import { AllProcessSensorData } from "@/_assets/SensorData";
import { useProcessContext } from "@/context/ProcessContext";

const VibrationReportDownload: React.FC = () => {
  const { processId } = useProcessContext();

  const handleDownloadCSV = () => {
    const csvContent = [
      [
        "설비명",
        "Unit",
        "Unit 상태",
        "1개월 ISO 진동 레벨 수준 (mm/s)",
        "ISO 기준 1개월에 대한 상태 평가",
        "간이 진단 결과",
      ],
      ...AllProcessSensorData.filter(
        (sensor) => Math.ceil(sensor.id / 12) == parseInt(processId),
      ).map((item) => [
        item.name,
        item.unit,
        item.status,
        item.level,
        item.evaluation,
        item.result,
      ]),
    ]
      .map((e) => e.map((value) => `"${value}"`).join(","))
      .join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `processID : ${processId}_report.csv`);
  };

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={handleDownloadCSV}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        CSV 다운로드
      </button>
      {/* Your Report Content */}
    </div>
  );
};

export default VibrationReportDownload;

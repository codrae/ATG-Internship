"use client";


import React, { useEffect, useState, useMemo } from "react";
import { AllProcessSensorData } from "@/_assets/SensorData";
import Header from "@/components/layout/ReportsHeader";
import { ProcessList } from "@/_assets/ProcessData";
import { useProcessContext } from "@/context/ProcessContext";
import Link from "next/link";
import { SensorData, useSensors } from "@/hooks/useSensors";
import Header from "@/components/layout/Header";


const OverviewSection = ({
  currentProcess,
  sensorsForProcess,
  countGood,
  countWarning,
  countAlarm,
}: any) => (
  <div className="grid grid-cols-3 gap-4 mb-8 bg-white shadow-lg rounded-lg p-6 border border-gray-300">
    <div className="bg-[#8497B0] text-white p-6 rounded-lg">
      <p className="mb-2 text-right font-bold">공정명:</p>
      <p className="mb-2 text-right font-bold">진동 평가 기준:</p>
      <p className="mb-2 text-right font-bold">종류:</p>
      <p className="mb-2 text-right font-bold">기준 용량:</p>
      <p className="mb-2 text-right font-bold">메인 알람:</p>
      <p className="text-right font-bold">프리 알람:</p>
    </div>
    <div className="bg-white text-left p-6 rounded-lg shadow-md border border-gray-200">
      <p className="mb-2">
        <span className="font-semibold">{currentProcess?.name || "N/A"}</span>
      </p>
      <p className="mb-2">{currentProcess?.vibrationStandard || "N/A"}</p>
      <p className="mb-2">{currentProcess?.type || "N/A"}</p>
      <p className="mb-2">{currentProcess?.capacity || "N/A"}</p>
      <p className="mb-2">{currentProcess?.mainAlarm || "N/A"}</p>
      <p>{currentProcess?.preAlarm || "N/A"}</p>
    </div>
    <div className="bg-[#DDEBF7] p-6 text-right rounded-lg shadow-md border border-gray-200">
      <div className="grid grid-cols-2 gap-2 text-sm mt-10">
        <span className="font-medium">전체 설비 대수 :</span>
        <span className="text-left">{sensorsForProcess.length}</span>
        <span className="font-medium text-green-600">양호 :</span>
        <span className="text-green-600 font-semibold text-left">
          {countGood}
        </span>
        <span className="font-medium text-yellow-500">경고 :</span>
        <span className="text-yellow-500 font-semibold text-left">
          {countWarning}
        </span>
        <span className="font-medium text-red-500">알람 :</span>
        <span className="text-red-500 font-semibold text-left">
          {countAlarm}
        </span>
      </div>
    </div>
  </div>
);

const DataTableSection = ({ sensorsForProcess, processId }: any) => (
  <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden mt-4">
    <thead className="bg-[#8497B0] text-white">
      <tr>
        <th className="p-4 border text-center whitespace-nowrap">설비명</th>
        <th className="p-4 border text-center">Unit</th>
        <th className="p-4 border text-center whitespace-nowrap">Unit 상태</th>
        <th className="p-4 border text-center whitespace-normal">
          1개월 ISO 진동 레벨 수준 <br /> (mm/s)
        </th>
        <th className="p-4 border text-center">그래프</th>
        <th className="p-4 border text-center whitespace-normal">
          ISO 기준 1개월에 대한 <br /> 상태 평가
        </th>
        <th className="p-4 border text-center whitespace-nowrap">
          간이 진단 결과
        </th>
      </tr>
    </thead>
    <tbody>
      {sensorsForProcess.map((row: any) => (
        <tr
          key={row.id}
          className="text-sm hover:bg-gray-50 transition duration-200 ease-in-out"
        >
          <td className="p-4 border text-center font-medium">
            <Link
              href={`/factory/process/${processId}/${row.id}/trends`}
              className="text-blue-500 hover:underline"
            >
              {row.name}
            </Link>
          </td>
          <td className="p-4 border text-center">{row.unit}</td>
          <td className="p-4 border text-center font-semibold">
            <span
              className={
                row.status === "양호"
                  ? "text-green-600"
                  : row.status === "경고"
                    ? "text-yellow-500"
                    : "text-red-500"
              }
            >
              {row.status}
            </span>
          </td>
          <td className="p-4 border text-center">{row.level}</td>
          <td className="p-4 border">
            <div className="relative h-5 bg-gray-200 rounded">
              <div
                className={`absolute top-0 h-full rounded ${
                  row.status === "양호"
                    ? "bg-green-500"
                    : row.status === "경고"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(parseFloat(row.level) * 10, 100)}%`,
                }}
              />
            </div>
          </td>
          <td className="p-4 border text-center">{row.evaluation}</td>
          <td className="p-4 border text-center">{row.result}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const VibrationReport: React.FC = () => {
  const { processId } = useProcessContext();
  const [currentProcess, setCurrentProcess] = useState<any>(null);

  useEffect(() => {
    if (processId) {
      const process = ProcessList.find((p) => p.id === Number(processId));
      setCurrentProcess(process);
    }
  }, [processId]);


    sensors.forEach((sensor) => {
      const hasAlarm = sensor.alarmHistory?.some(
        (alarm) => alarm.type == "Alarm",
      );
      const hasWarning = sensor.alarmHistory?.some(
        (alarm) => alarm.type == "Warning",
      );

      if (hasAlarm) {
        alarmCount += 1;
      } else if (hasWarning) {
        warningCount += 1;
      }
    });

    return {
      countWarning: warningCount,
      countAlarm: alarmCount,
      countGood: sensors.length - (warningCount + alarmCount),
    };
  }, [sensors]);

  const getSensorStatus = (
    sensor: SensorData,
  ): "ALARM" | "WARNING" | "GOOD" => {
    if (sensor.alarmHistory?.some((alarm) => alarm.type == "ALARM")) {
      return "ALARM";
    } else if (sensor.alarmHistory?.some((alarm) => alarm.type == "WARNING")) {
      return "WARNING";
    } else {
      return "GOOD";
    }
  };

  if (!currentProcess) {
    return <p>데이터를 불러오는 중...</p>;
  }

  return (
    <div id="content" className="p-8 bg-gray-100 mb-0">
      <Header maxReportsId="10" />

      <OverviewSection
        currentProcess={currentProcess}
        sensorsForProcess={sensorsForProcess}
        countGood={countGood}
        countWarning={countWarning}
        countAlarm={countAlarm}
      />
      <div className="p-4 text-center bg-[#DDEBF7] border-b border-gray-300 text-lg font-semibold">
        진단 결과 요약 - 화학동
      </div>
      <DataTableSection
        sensorsForProcess={sensorsForProcess}
        processId={processId}
      />
    </div>
  );
};

export default VibrationReport;

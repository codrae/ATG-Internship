"use client";

import React, { useEffect, useState } from "react";
import { AllProcessSensorData, SensorData } from "@/_assets/SensorData";
import * as echarts from "echarts";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation"; // Next.js 라우터 사용

interface SensorDetailProps {
  processId: string;
  sensorId: string;
}

const SensorTrends: React.FC<SensorDetailProps> = ({ processId, sensorId }) => {
  const router = useRouter(); // 라우터 초기화
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [historyData, setHistoryData] = useState<number[]>([]);

  useEffect(() => {
    // 해당 `sensorId`에 맞는 센서 데이터를 검색
    const data = AllProcessSensorData.find(
      (sensor) => sensor.id === Number(sensorId),
    );
    if (data) setSensorData(data);

    // 샘플 history 데이터를 생성 (실제로는 서버에서 가져오는 방식 추천)
    const sampleHistory = Array.from({ length: 30 }, () => Math.random() * 10);
    setHistoryData(sampleHistory);
  }, [sensorId]);

  useEffect(() => {
    if (historyData.length) {
      const chartDom = document.getElementById("historyChart")!;
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: "Sensor History Data",
          left: "center",
        },
        xAxis: {
          type: "category",
          data: Array.from(
            { length: historyData.length },
            (_, i) => `Day ${i + 1}`,
          ),
        },
        yAxis: {
          type: "value",
          name: "Vibration Level (mm/s)",
        },
        series: [
          {
            data: historyData,
            type: "line",
            smooth: true,
            name: "Vibration Level",
          },
        ],
      };

      myChart.setOption(option);
      return () => myChart.dispose();
    }
  }, [historyData]);

  const downloadCSV = () => {
    if (historyData.length === 0) return;
    const csvContent = `data:text/csv;charset=utf-8,Date,Vibration Level (mm/s)\n${historyData
      .map((value, index) => `Day ${index + 1},${value}`)
      .join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sensor_${sensorId}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const captureChart = () => {
    const chartDom = document.getElementById("historyChart")!;
    html2canvas(chartDom).then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, `sensor_${sensorId}_chart.png`);
      });
    });
  };

  const goToFFT = () => {
    router.push(`/factory/process/${processId}/${sensorId}/fft`);
  };

  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">
        Process {processId} - Sensor {sensorData?.name} Detail Report
      </h1>
      {sensorData && (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 mb-8">
          <p>
            <strong>Unit:</strong> {sensorData.unit}
          </p>
          <p>
            <strong>Status:</strong> {sensorData.status}
          </p>
          <p>
            <strong>Level:</strong> {sensorData.level} mm/s
          </p>
          <p>
            <strong>Evaluation:</strong> {sensorData.evaluation}
          </p>
          <p>
            <strong>Result:</strong> {sensorData.result}
          </p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Sensor Vibration History</h2>
      <div
        id="historyChart"
        className="w-full h-96 mb-4 bg-white border border-gray-300 rounded-lg"
      ></div>

      <div className="flex space-x-4">
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Download CSV
        </button>
        <button
          onClick={captureChart}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Capture Chart
        </button>
        <button
          onClick={goToFFT}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700"
        >
          Go to FFT
        </button>
      </div>
    </div>
  );
};

export default SensorTrends;

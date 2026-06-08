"use client";

import React, { useEffect, useState } from "react";

interface SensorStatusProps {
  processId: number;
  sensorId: number;
}

const SensorStatus: React.FC<SensorStatusProps> = ({ processId, sensorId }) => {
  const [sensorData, setSensorData] = useState({
    status: "양호",
    vibrationLevel: "0.00",
    temperature: "0.0",
  });

  useEffect(() => {
    // Mock 데이터 생성 (실제 API 호출로 대체 가능)
    const randomStatus = ["양호", "경고", "알람"][
      Math.floor(Math.random() * 3)
    ];
    const randomVibration = (Math.random() * 10).toFixed(2);
    const randomTemperature = (Math.random() * 100).toFixed(1);

    setSensorData({
      status: randomStatus,
      vibrationLevel: randomVibration,
      temperature: randomTemperature,
    });
  }, [sensorId]);

  return (
    <div>
      <p>
        {processId}프로세스의 {sensorId}번 센서
      </p>
      <p>
        <span className="font-semibold">상태:</span>{" "}
        <span
          className={
            sensorData.status === "양호"
              ? "text-green-600"
              : sensorData.status === "경고"
                ? "text-yellow-500"
                : "text-red-500"
          }
        >
          {sensorData.status}
        </span>
      </p>
      <p>
        <span className="font-semibold">진동 레벨:</span>{" "}
        {sensorData.vibrationLevel} mm/s
      </p>
      <p>
        <span className="font-semibold">온도:</span> {sensorData.temperature}°C
      </p>
    </div>
  );
};

export default SensorStatus;

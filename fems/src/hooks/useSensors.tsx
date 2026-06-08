/*
  processId(machineId)에 속해있는 Sensors 데이터를 관리한다.
 */

import { useEffect, useState } from "react";
import { AlarmHistory } from "@/hooks/useAlarms";

export interface SensorData {
  sensorId: string; // 센서 ID - Resource Id
  name: string; // 센서 이름 ex. Drive-Engine-1
  sensorType: string; // 센서 종류 ex. AW-5
  alarmHistory: AlarmHistory[]; // 센서의 알람 기록
}

export const useSensors = (machineId: string, sensorIds: string[]) => {
  const [sensors, setSensors] = useState<SensorData[]>([]);

  // sensorData 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 각 센서 정보 비동기적으로 조회
        const fetchPromises = sensorIds.map(async (id) => {
          const response = await fetch(`/measurement_points/${id}`);
          if (!response.ok) {
            throw new Error(`Measurement points not found at SensorId: ${id}`);
          }
          const data = await response.json();

          return {
            sensorId: id,
            name: data.name,
            sensorType: data.sensorType,
          };
        });

        // 단일 SensorData[] 배열 객체로 저장
        const sensorsData = await Promise.all(fetchPromises);

        const [mainAlarmResponse, preAlarmResponse] = await Promise.all([
          fetch(
            `/machine/:${machineId}/alarm-history?endtime=1699999990000&group=ISO alarm`,
          ),
          fetch(
            `/machine/:${machineId}/alarm-history?endtime=1699999990000&group=ISO pre-alarm`,
          ),
        ]);

        if (!mainAlarmResponse.ok || !preAlarmResponse.ok) {
          throw new Error(
            `Failed to fetch alarm data: alarm: ${mainAlarmResponse.status},pre-alarm: ${preAlarmResponse.status}`,
          );
        }

        const [mainAlarmData, preAlarmData]: [AlarmHistory[], AlarmHistory[]] =
          await Promise.all([
            mainAlarmResponse.json(),
            preAlarmResponse.json(),
          ]);

        const allAlarmData = [...mainAlarmData, ...preAlarmData];

        const sensorsDataWithAlarms = sensorsData.map((sensor) => ({
          ...sensor,
          alarmHistory: allAlarmData.filter(
            (alarm) => alarm.resourceId === sensor.sensorId,
          ),
        }));

        setSensors(sensorsDataWithAlarms);
      } catch (error) {
        console.error(error);
      }
    };

    // 조회된 sensors 배열의 길이가 0보다 클 경우 새로운 데이터 조회
    if (sensorIds.length > 0) {
      fetchData();
    }
  }, [machineId, sensorIds]);

  return { sensors };
};

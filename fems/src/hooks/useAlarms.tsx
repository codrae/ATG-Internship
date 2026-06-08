/*
    machineId의 alarm history 조회
 */

import { useEffect, useState } from "react";

interface AlarmHistory {
  resourceId: string; // sensorId
  group: string; // alarm key attribute: ISO pre-alarm / ISO alarm
  type: string; // warning / alarm
  description: string;
  eventState: string; // INACTIVE / ACTIVE
  comment: string; // if eventStatus is active, null
}

export const useAlarmHistory = (machineId: string, sensorIds: string[]) => {
  const [, setAlarmHistory] = useState<Record<string, AlarmHistory[]>>({});

  useEffect(() => {
    const alarmFetchData = async () => {
      try {
        // ISO alarm과 ISO pre-alarm에 대해 동시 요청
        const [alarmResponse, preAlarmResponse] = await Promise.all([
          fetch(
            `/machine/:${machineId}/alarm-history?endtime=1699999990000&group=ISO alarm`,
          ),
          fetch(
            `/machine/:${machineId}/alarm-history?endtime=1699999990000&group=ISO pre-alarm`,
          ),
        ]);
        if (!alarmResponse.ok || !preAlarmResponse.ok) {
          throw new Error(
            `Failed to fetch alarm data: alarm: ${alarmResponse.status},pre-alarm: ${preAlarmResponse.status}`,
          );
        }

        // 응답 데이터를 AlarmHistory 배열로 저장
        const [alarmData, preAlarmData]: [AlarmHistory[], AlarmHistory[]] =
          await Promise.all([alarmResponse.json(), preAlarmResponse.json()]);

        // sensorIs와 alarm 종류를 매핑 -> <sensorId, AlarmHistory> 형태로 저장
        const mappedData: Record<string, AlarmHistory[]> = {};
        sensorIds.forEach((sensorId) => {
          mappedData[sensorId] = [
            ...alarmData.filter((alarm) => alarm.resourceId === sensorId),
            ...preAlarmData.filter((alarm) => alarm.resourceId === sensorId),
          ];
        });

        setAlarmHistory(mappedData);
      } catch (error) {
        console.error(error);
      }
    };

    if (sensorIds.length > 0) {
      alarmFetchData();
    }
  }, [machineId, sensorIds]);
};

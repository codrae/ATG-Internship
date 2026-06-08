// src/data/SensorData.ts

// import { ProcessList } from "@/_assets/ProcessData";

export interface SensorData {
  sensorId: string; // Resource Id
  name: string; // ex. Drive-Engine-1
  sensorType: string; // ex. AW-5
}

// // 랜덤한 데이터 생성을 위한 함수
// function getRandomLevel(): string {
//     return (Math.random() * 10).toFixed(2); // 0 ~ 10 사이의 랜덤 소수 값
// }
//
// function getRandomEvaluation(status: string): string {
//     if (status === "양호") return "장기간 운전 허용";
//     if (status === "경고") return "정기 점검 필요";
//     return "즉각 점검 필요";
// }
//
// function getRandomResult(status: string): string {
//     if (status === "양호") return "설비 정상";
//     if (status === "경고") return "부분적 이상";
//     return "심각한 이상";
// }
//
// function getRandomUnit(): string {
//     const units = ["Valve", "Blower", "Compressor", "Heater", "Bearing", "Coupling", "Pump", "Gearbox", "Shaft", "Fan"];
//     return units[Math.floor(Math.random() * units.length)];
// }
//
// // 12개의 센서 데이터를 각 프로세스마다 생성
// export const generateSensors = (processId: number): SensorData[] => {
//     const process = ProcessList.find(p => p.id === processId);
//     if (!process) throw new Error(`Process with id ${processId} not found`);
//
//     const mainAlarm = parseFloat(process.mainAlarm); // mainAlarm 값을 숫자로 변환
//     const preAlarm = parseFloat(process.preAlarm);   // preAlarm 값을 숫자로 변환
//
//     return Array.from({ length: 12 }, (_, i) => {
//         const level = getRandomLevel();
//         const numericLevel = parseFloat(level);
//
//         // level 값을 기준으로 status 결정
//         let status = "양호";
//         if (numericLevel >= mainAlarm) {
//             status = "알람";
//         } else if (numericLevel >= preAlarm) {
//             status = "경고";
//         }
//
//         return {
//             id: i - 11 + processId * 12, // 각 프로세스의 센서 ID를 고유하게 설정
//             name: `Sensor_${processId}_${i + 1}`,
//             unit: getRandomUnit(),
//             status,
//             level,
//             evaluation: getRandomEvaluation(status),
//             result: getRandomResult(status),
//         };
//     });
// };
//
// // 모든 프로세스의 센서 리스트를 생성
// export const AllProcessSensorData: SensorData[] = [];
// for (let processId = 1; processId <= 10; processId++) {
//     AllProcessSensorData.push(...generateSensors(processId));
// }

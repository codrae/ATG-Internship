// 프로젝트 전반에 걸쳐 공통으로 사용되는 타입은 여기에 두겠습니다.

export interface DataPoint {
  energyType: string;
  dateTime: [number, number, number, number, number];
  value: number; // dataValue
}

// STOMP 메시지
export interface BuildingData {
  [building: string]: {
    [energyType: string]: DataPoint[];
  };
}

export type BuildingDataMap = {
  [building: string]: DataPoint[];
};

export interface Building {
  name: string;
}

export interface BuildingProps {
  buildingId: number;
  energyTypeId: number;
}

export interface AnomalyItem {
  createdAt: string;
  value: number;
  predict: number;
  building: Building;
}

export interface EnergyUsage {
  value: number;
}

// pieData 인터페이스 정의
export interface mock {
  name: string;
  value: number;
}

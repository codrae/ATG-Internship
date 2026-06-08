// src/data/buildings.ts
export const buildingsDict: Record<string, string[]> = {
  "building-1": ["POWER", "HEAT", "GAS"],
  "anniversary-memorial-hall": ["POWER", "HEAT", "GAS"],
  "law-school-building": ["POWER", "HEAT", "GAS"],
  "inha-dream-center-2-3": ["POWER", "HEAT", "GAS"],
  "high-tech-center": ["POWER", "HEAT", "GAS"],
};

interface BuildingName {
  [building_id: string]: [string, string];
}

interface EnergyTypeName {
  [energy_type: string]: [number, string];
}

export const buildingName: BuildingName = {
  BUILDING_1: ["building-1", "1호관"],
  ANNIVERSARY_MEMORIAL_HALL: ["anniversary-memorial-hall", "60주년기념관"],
  LAW_SCHOOL_BUILDING: ["law-school-building", "로스쿨"],
  INHA_DREAM_CENTER_2_3: ["inha-dream-center-2-3", "인하드림센터2/3관"],
  HIGH_TECH_CENTER: ["high-tech-center", "하이테크센터"],
};

export const energyTypeName: EnergyTypeName = {
  POWER: [1, "전력"],
  GAS: [2, "열"],
  HEAT: [3, "가스"],
};

export const BuildingId: Record<number, string> = {
  1: "building-1",
  2: "anniversary-memorial-hall",
  3: "law-school-building",
  4: "inha-dream-center-2-3",
  5: "high-tech-center",
};

export const EnergyTypeId: Record<number, string> = {
  1: "POWER",
  2: "GAS",
  3: "HEAT",
};

export const urlToBuildingId: Record<string, string> = Object.entries(
  buildingName,
).reduce(
  (acc, [id, [url]]) => {
    acc[url] = id;
    return acc;
  },
  {} as Record<string, string>,
);

export const urlToBuildingKorean: Record<string, string> = Object.entries(
  buildingName,
).reduce(
  (acc, [, [url, korean]]) => {
    acc[url] = korean;
    return acc;
  },
  {} as Record<string, string>,
);

export const idToEnergyKorean: Record<number, string> = Object.entries(
  energyTypeName,
).reduce(
  (acc, [, [id, korean]]) => {
    acc[id] = korean;
    return acc;
  },
  {} as Record<number, string>,
);

export const koreanToBuildingNumber: Record<string, number> = Object.entries(
  buildingName,
).reduce(
  (acc, [, [url, korean]]) => {
    const numberId = Number(
      Object.keys(BuildingId).find((id) => BuildingId[Number(id)] === url),
    );
    if (numberId) acc[korean] = numberId;
    return acc;
  },
  {} as Record<string, number>,
);

export const getBuildingNumberByKoreanName = (
  koreanName: string,
): number | null => {
  return koreanToBuildingNumber[koreanName] || null;
};

export type BuildingKey =
  //  | "building-5"
  | "building-1"
  // | "inha-library"
  // | "inha-dream-center"
  | "law-school-building"
  | "anniversary-memorial-hall"
  | "inha-dream-center-2-3"
  | "high-tech-center";

export interface BuildingInfo {
  name: string;
  description: string;
  monitorLink: string;
  imageSrc: string; // 건물 이미지 경로
  yearBuilt: string; // 완공 연도
  area: string; // 연면적
  floors: string; // 건물 규모
}

export const buildingInfo: Record<BuildingKey, BuildingInfo> = {
  // "building-5": {
  //   name: "5호관",
  //   description:
  //     "5호관은 전자공학 및 컴퓨터공학 관련 강의실이 위치한 건물입니다.",
  //   monitorLink: "/monitoring/2/1",
  //   imageSrc: "/images/building/building-5.png",
  //   yearBuilt: "2008년",
  //   area: "15,000m²",
  //   floors: "지상 8층",
  // },
  "building-1": {
    name: "1호관",
    description: "1호관은 인문학 및 사회과학 강의가 이루어지는 건물입니다.",
    monitorLink: "/monitoring/1/1",
    imageSrc: "/images/building/building-1.png",
    yearBuilt: "2005년",
    area: "18,000m²",
    floors: "지하 1층, 지상 7층",
  },
  // "inha-library": {
  //   name: "정석학술정보관",
  //   description:
  //     "정석학술정보관은 학생들이 자유롭게 이용할 수 있는 도서관과 학습 공간이 있습니다.",
  //   monitorLink: "/monitoring/4/1",
  //   imageSrc: "/images/building/inha-library.png",
  //   yearBuilt: "2016년",
  //   area: "25,913m²",
  //   floors: "지하 1층, 지상 15층",
  // },
  // "inha-dream-center": {
  //   name: "김현태 인하 드림 센터",
  //   description:
  //     "김현태 인하 드림 센터는 학생들이 자유롭게 이용할 수 있는 도서관과 학습 공간이 있습니다.",
  //   monitorLink: "/monitoring/5/1",
  //   imageSrc: "/images/building/inha-dream-center.png",
  //   yearBuilt: "2016년",
  //   area: "25,913m²",
  //   floors: "지하 1층, 지상 15층",
  // },
  "inha-dream-center-2-3": {
    name: "인하 드림 센터2/3관",
    description:
      "인하 드림 센터2/3관은 학생들이 자유롭게 이용할 수 있는 도서관과 학습 공간이 있습니다.",
    monitorLink: "/monitoring/4/1",
    imageSrc: "/images/building/inha-dream-center-2-3.png",
    yearBuilt: "2016년",
    area: "25,913m²",
    floors: "지하 1층, 지상 15층",
  },
  "law-school-building": {
    name: "로스쿨관",
    description:
      "로스쿨관은 학생들이 자유롭게 이용할 수 있는 도서관과 학습 공간이 있습니다.",
    monitorLink: "/monitoring/3/1",
    imageSrc: "/images/building/law-school-building.png",
    yearBuilt: "2016년",
    area: "25,913m²",
    floors: "지하 1층, 지상 15층",
  },
  "anniversary-memorial-hall": {
    name: "60주년기념관",
    description:
      "60주년기념관은 학생들이 자유롭게 이용할 수 있는 도서관과 학습 공간이 있습니다.",
    monitorLink: "/monitoring/2/1",
    imageSrc: "/images/building/60-anniversary-memorial-hall.png",
    yearBuilt: "2014년",
    area: "25,913m²",
    floors: "지하 1층, 지상 17층",
  },
  "high-tech-center": {
    name: "하이테크 센터",
    description:
      "하이테크센터는 학생들이 자유롭게 이용할 수 있는 도서관과 학습 공간이 있습니다.",
    monitorLink: "/monitoring/5/1",
    imageSrc: "/images/building/high-tech-center.png",
    yearBuilt: "2003년",
    area: "21,750m²",
    floors: "지하 1층, 지상 15층",
  },
};

export interface UnitStandard {
  maxUsage: number; // 연간 단위 면적당 1차 에너지소비량 (kWh/m^2) -> 미만
  minUsage?: number; // 연간 단위 면적당 1차 에너지소비량 (kWh/m^2) -> 이상
}

// 건축물 에너지 효율 등급 인증 시스템 인증 기준
export const buildingUnitStandard: Record<string, UnitStandard> = {
  "1+++": {
    maxUsage: 80,
  },
  "1++": {
    minUsage: 80,
    maxUsage: 140,
  },
  "1+": {
    minUsage: 140,
    maxUsage: 200,
  },
  "1": {
    minUsage: 200,
    maxUsage: 260,
  },
  "2": {
    minUsage: 260,
    maxUsage: 320,
  },
  "3": {
    minUsage: 320,
    maxUsage: 380,
  },
  "4": {
    minUsage: 380,
    maxUsage: 450,
  },
  "5": {
    minUsage: 450,
    maxUsage: 520,
  },
  "6": {
    minUsage: 520,
    maxUsage: 610,
  },
  "7": {
    minUsage: 610,
    maxUsage: 700,
  },
};

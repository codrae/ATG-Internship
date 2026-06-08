// src/data/chartData.ts

export const lineChartData = {
  xAxisData: ["January", "February", "March", "April", "May", "June", "July"],
  seriesData: [65, 59, 80, 81, 56, 55, 40],
};

export const alertData = [
  {
    location: "60aniv",
    equipment: "pump",
    fault: "pipe",
    date: "2023.12.11",
    severity: "상 (danger)",
  },
  {
    location: "hitech",
    equipment: "elec",
    fault: "speer",
    date: "2024.1.13",
    severity: "중",
  },
];

export const adminComments = [
  { name: "김철수", content: "2024.12.11 본관 점검 예정", date: "2024.12.1" },
  { name: "박철수", content: "60주년 기념관 결함 발견", date: "2024.10.13" },
];

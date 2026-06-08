import * as echarts from "echarts";

const HorizontalBar: echarts.EChartsOption = {
  dataset: {
    source: [
      ["score", "amount", "product"], // score: 실제 사용량, amount: 목표 사용량
      [80, 100, "전력"], // 전력: 목표 100, 실제 80
      [70, 90, "가스"], // 가스: 목표 90, 실제 70
      [50, 60, "열에너지"], // 열에너지: 목표 60, 실제 50
      [95, 100, "물"], // 물: 목표 100, 실제 95
      [40, 80, "조명"], // 조명: 목표 80, 실제 40
    ],
  },
  grid: { containLabel: true },
  xAxis: { name: "목표 사용량" }, // x축: 목표 사용량
  yAxis: { type: "category" }, // y축: 에너지 항목
  visualMap: {
    orient: "horizontal",
    left: "center",
    min: 0,
    max: 100,
    text: ["높음 (달성도)", "낮음 (달성도)"],
    dimension: 0, // score 컬럼을 색상에 매핑
    inRange: {
      color: ["#65B581", "#FFCE34", "#FD665F"], // 색상 범위 (초록-노랑-빨강)
    },
  },
  series: [
    {
      type: "bar",
      encode: {
        x: "amount", // 목표 사용량을 x축에 매핑
        y: "product", // 에너지 항목을 y축에 매핑
      },
    },
  ],
};

export default HorizontalBar;

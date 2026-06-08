import * as echarts from "echarts";

interface BarOptionConfig {
  colors?: string[] | string; // 색상 배열 또는 단일 색상
  markLine?: echarts.MarkLineComponentOption; // markLine 옵션
}

export const createBarOption = (
  data: { name: string; value: number }[], // 데이터 배열
  config: BarOptionConfig = {}, // 추가 옵션
): echarts.EChartsOption => {
  const { colors, markLine } = config;
  const isSingleColor = typeof colors === "string";

  return {
    legend: { show: false },
    tooltip: { trigger: "axis" },
    dataset: { dimensions: ["name", "value"], source: data },
    xAxis: {
      type: "category",
      axisLabel: { fontSize: 12, color: "#333" },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 12, color: "#333" },
      splitLine: { show: false },
    },
    series: [
      {
        type: "bar",
        encode: { x: "name", y: "value" },
        itemStyle: {
          color: isSingleColor
            ? colors
            : (params) => colors?.[params.dataIndex] || "#22D3EE",
        },
        barWidth: "70%", // 바 너비 설정
        markLine,
      },
    ],
    grid: { left: "15%", right: "10%", bottom: "10%", top: "20%" },
  };
};

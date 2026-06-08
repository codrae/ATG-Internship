import * as echarts from "echarts";

export interface HorizontalBarData {
  name: string; // 에너지 유형
  value: number; // 비율
  color: string; // 색상
  icon: string; // 아이콘 (유니코드나 이미지 경로)
}

export const createHorizontalStackedBar = (
  data: HorizontalBarData[], // 데이터 배열
): echarts.EChartsOption => {
  const validData = Array.isArray(data) ? data : []; // 데이터가 배열이 아니면 빈 배열 사용

  return {
    grid: {
      top: "10%",
      left: "0%",
      right: "0%",
      bottom: "40%", // 막대 아래 아이콘 공간 확보
      containLabel: true,
    },
    xAxis: {
      type: "value",
      show: false, // x축 숨김
      max: 100,
    },
    yAxis: {
      type: "category",
      show: false, // y축 숨김
      data: ["총 비용"],
    },
    series: validData.map((item) => ({
      name: item.name,
      type: "bar",
      stack: "total",
      barWidth: 60,
      label: {
        show: true,
        position: "inside",
        color: "#fff",
        fontWeight: "bold",
        formatter: "{c}%",
      },
      data: [
        {
          value: item.value,
          itemStyle: { color: item.color },
        },
      ],
    })),
    graphic: validData.map((item, index) => ({
      type: "group",
      left: `${index * 33.3 + 16}%`, // 막대 아래 위치 조정
      bottom: 0,
      children: [
        {
          type: "image",
          style: {
            image: item.icon, // 아이콘
            width: 18,
            height: 18,
          },
          left: "center",
          top: "center",
        },
        {
          type: "text",
          style: {
            text: item.name,
            fontSize: 12,
            fontWeight: "bold",
            fill: "#777",
          },
          left: "center",
          top: 25,
        },
      ],
    })),
  };
};

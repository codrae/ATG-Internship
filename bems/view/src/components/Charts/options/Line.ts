import * as echarts from "echarts";

const Line: echarts.EChartsOption = {
  title: {
    text: "에너지 사용량 추세",
    left: "center",
    textStyle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
  },
  tooltip: {
    trigger: "axis", // 축 기반 툴팁
    axisPointer: {
      type: "line", // 툴팁의 기준: 선형
    },
    formatter: "{b}<br />{a}: {c} kW", // 툴팁 형식
  },
  xAxis: {
    type: "category",
    boundaryGap: false, // 라인이 좌우 끝에 닿도록 설정
    data: ["10:00", "11:00", "12:00", "13:00", "14:00"], // x축 데이터
    axisLine: {
      lineStyle: {
        color: "#888",
      },
    },
    axisLabel: {
      fontSize: 12,
      color: "#666",
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      lineStyle: {
        color: "#888",
      },
    },
    axisLabel: {
      formatter: "{value} kW", // y축 단위 추가
      fontSize: 12,
      color: "#666",
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "#ddd",
      },
    },
  },
  series: [
    {
      name: "에너지 사용량",
      type: "line",
      data: [10, 20, 15, 25, 30], // y축 데이터
      smooth: true, // 곡선으로 렌더링
      lineStyle: {
        color: "#4CAF50", // 라인 색상
        width: 2,
      },
      itemStyle: {
        color: "#4CAF50", // 데이터 포인트 색상
      },
      areaStyle: {
        color: "rgba(76, 175, 80, 0.2)", // 라인 아래 면적 색상
      },
    },
  ],
  grid: {
    left: "10%",
    right: "10%",
    bottom: "15%",
    containLabel: true, // 레이블이 차트 안에 표시되도록 설정
  },
};

export default Line;

import * as echarts from "echarts";

export interface PieData {
  name: string;
  value: number;
}

export const Pie = (
  data: PieData[] = [], // 기본값으로 빈 배열
  title?: string, // 선택적 매개변수
  subtitle?: string, // 선택적 매개변수
  colors: string[] = ["#5470C6", "#91CC75", "#FAC858", "#EE6666", "#73C0DE"], // 기본 색상
  centerIcon?: string, // 중앙 SVG 경로 (선택적)
  backgroundColor: string = "#FFFFFF", // 기본 중심 배경 색상
  margin: number = 20, // 기본 여백
): echarts.EChartsOption => {
  const seriesOption: echarts.SeriesOption = {
    name: title || "데이터",
    type: "pie",
    radius: centerIcon ? ["50%", "70%"] : "70%", // 아이콘이 있으면 도넛 스타일, 없으면 전체
    center: ["50%", "50%"],
    data: data.length ? data : [{ name: "없음", value: 1 }], // 데이터 없을 때 기본값
    color: colors,
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
    label: {
      show: true,
      position: "outside", // 레이블을 외부로 설정
      formatter: "{b}",
    },
    labelLine: {
      show: true,
      length: 15, // 선의 길이
      length2: 10, // 두 번째 선의 길이
    },
  };

  // 중심에 아이콘 추가
  const graphicOption: echarts.GraphicComponentOption = centerIcon
    ? {
        type: "image",
        style: {
          image: centerIcon,
          width: 80, // 아이콘 너비
          height: 80, // 아이콘 높이
        },
        left: "center",
        top: "center",
      }
    : {
        type: "circle",
        shape: {
          cx: 0,
          cy: 0,
          r: 50,
        },
        style: {
          fill: backgroundColor, // 중심 채우기 색상
        },
        left: "center",
        top: "center",
      };

  return {
    title:
      title || subtitle
        ? {
            text: title || "",
            subtext: subtitle || "",
            left: "center",
          }
        : undefined, // title과 subtitle 둘 다 없으면 제외
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    grid: {
      left: margin,
      right: margin,
      top: margin,
      bottom: margin,
    },
    series: [seriesOption],
    graphic: [graphicOption], // 중심 SVG나 배경 채우기
  };
};

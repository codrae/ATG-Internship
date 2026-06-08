import { EChartsOption } from "echarts";

interface ProgressBarOptionProps {
  progress: number; // 진행률 (0 ~ 100%)
  barColor?: string; // 진행 바 단색 (기본값: 초록색)
  barGradient?: [string, string]; // 진행 바 그라데이션 색상 (시작, 끝)
  backgroundColor?: string; // 배경 바 색상 (기본값: 회색)
  barWidth?: number; // 진행 바 두께 (기본값: 20)
}

export const getProgressBarOption = ({
  progress,
  barColor = "#4CAF50", // 기본 단색
  barGradient, // 그라데이션 색상
  backgroundColor = "#E0E0E0", // 배경 색상
  barWidth = 20, // 기본 바 두께
}: ProgressBarOptionProps): EChartsOption => {
  return {
    xAxis: {
      max: 100, // 최대값을 100%로 설정
      show: false, // X축 숨김
    },
    yAxis: {
      type: "category",
      data: [""], // 단일 데이터
      show: false, // Y축 숨김
    },
    series: [
      {
        type: "bar",
        data: [progress], // 진행률 값
        barWidth, // 진행 바 두께
        itemStyle: {
          color: barGradient
            ? {
                type: "linear",
                x: 0, // 시작 위치 (왼쪽)
                y: 0,
                x2: 1, // 끝 위치 (오른쪽)
                y2: 0,
                colorStops: [
                  { offset: 0, color: barGradient[0] }, // 시작 색상
                  { offset: 1, color: barGradient[1] }, // 끝 색상
                ],
              }
            : barColor, // 단색 또는 그라데이션 색상
          borderRadius: [10, 10, 10, 10], // 둥근 모서리
        },
        z: 1, // 진행 바가 위에 표시되도록 설정
      },
      {
        type: "bar",
        data: [100], // 전체 100% 바
        barWidth, // 배경 바 두께
        itemStyle: {
          color: backgroundColor, // 배경 바 색상
          borderRadius: [10, 10, 10, 10],
        },
        barGap: "-100%", // 진행 바와 겹치도록 설정
        z: 0, // 배경 바가 뒤에 표시되도록 설정
      },
    ],
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      containLabel: false,
    },
  };
};

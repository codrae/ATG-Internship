"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface EChartsComponentProps {
  option: echarts.EChartsOption; // ECharts 옵션
  dataset?: echarts.EChartsOption["dataset"]; // ECharts 데이터셋
  style?: React.CSSProperties; // 스타일
  title?: string; // 차트 제목
}

const EChartsComponent: React.FC<EChartsComponentProps> = ({
  option,
  dataset,
  style = { width: "100%", height: "150px" }, // 기본값
  title,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);

    // 옵션에 title 추가
    const mergedOption = {
      ...option,
      dataset: dataset || option.dataset,
      title: title
        ? {
            ...option.title,
            text: title, // 전달된 title 값
            left: "left", // 기본적으로 중앙에 정렬
            textStyle: {
              fontSize: 14,
              fontWeight: "bold",
            },
          }
        : option.title, // title이 없으면 기존 title 유지
    };

    // 옵션 적용
    myChart.setOption(mergedOption);

    // 컴포넌트 언마운트 시 차트 해제
    return () => {
      myChart.dispose();
    };
  }, [option, dataset, title]); // option, dataset, title 변경 시 업데이트

  return (
    <div>
      <div ref={chartRef} style={style} />
    </div>
  );
};

export default EChartsComponent;

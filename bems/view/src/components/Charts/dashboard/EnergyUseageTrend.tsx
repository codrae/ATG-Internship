"use client";

import React from "react";
import EChartsComponent from "@/components/Charts/MyEcharts";

const EnergyUsageTrend: React.FC = () => {
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow", // Shadow effect for bars
      },
    },
    legend: {
      top: "5%", // 상단 여백
      right: "5%", // 우측 정렬
      orient: "horizontal", // 가로 정렬
      itemGap: 20, // 아이콘 간격
      // icon: "none", // 기본 아이콘(색상) 제거
      formatter: (name: string) => {
        // 유니코드와 텍스트 결합
        const iconMap: { [key: string]: string } = {
          전기: "⚡", // 번개
          열: "🔥", // 불꽃
          가스: "💨", // 바람
          "실내 기온": "️🏠", // 온도계
          "실외 기온": "☁️", // 눈송이
        };
        return `${iconMap[name] || ""} ${name}`; // 유니코드 아이콘 + 텍스트
      },
      textStyle: {
        fontSize: 12,
        color: "#333", // 텍스트 색상
      },
      data: ["전기", "열", "가스", "실내 기온", "실외 기온"],
    },
    dataset: {
      source: [
        {
          month: "8월",
          전기: 5,
          열: 6,
          가스: 3,
          "실내 기온": 30,
          "실외 기온": 38,
        },
        {
          month: "9월",
          전기: 10,
          열: 8,
          가스: 8,
          "실내 기온": 28,
          "실외 기온": 32,
        },
        {
          month: "10월",
          전기: 2,
          열: 1,
          가스: 1,
          "실내 기온": 26,
          "실외 기온": 20,
        },
        {
          month: "11월",
          전기: 5,
          열: 7,
          가스: 3,
          "실내 기온": 20,
          "실외 기온": 10,
        },
      ],
    },
    xAxis: {
      type: "category",
      axisLabel: { fontSize: 12 },
    },
    yAxis: [
      {
        type: "value",
        name: "사용량",
        position: "left",
        axisLabel: { fontSize: 12 },
      },
      {
        type: "value",
        name: "온도 (℃)",
        position: "right",
        axisLabel: { fontSize: 12 },
      },
    ],
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "40%",
      containLabel: true,
    },
    series: [
      {
        name: "전기",
        type: "bar",
        encode: { x: "month", y: "전기" },
        itemStyle: { color: "#FACC15" }, // 노란색
        barWidth: "20%",
      },
      {
        name: "열",
        type: "bar",
        encode: { x: "month", y: "열" },
        itemStyle: { color: "#FB7185" }, // 빨간색
        barWidth: "20%",
      },
      {
        name: "가스",
        type: "bar",
        encode: { x: "month", y: "가스" },
        itemStyle: { color: "#60A5FA" }, // 파란색
        barWidth: "20%",
      },
      {
        name: "실내 기온",
        type: "line",
        encode: { x: "month", y: "실내 기온" },
        yAxisIndex: 1,
        itemStyle: { color: "#3B82F6" }, // 하늘색
        lineStyle: { width: 2 },
        symbol: "circle",
        symbolSize: 8,
      },
      {
        name: "실외 기온",
        type: "line",
        encode: { x: "month", y: "실외 기온" },
        yAxisIndex: 1,
        itemStyle: { color: "#22C55E" }, // 초록색
        lineStyle: { width: 2 },
        symbol: "circle",
        symbolSize: 8,
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="text-slate-950 text-xl font-bold font-['Pretendard'] leading-7">
        전체 에너지원별 사용 현황
      </div>
      <EChartsComponent option={option} />
    </div>
  );
};

export default EnergyUsageTrend;

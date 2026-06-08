"use client";

import React, { useMemo, useState } from "react";
import { DataPoint } from "@/types";
import {
  BuildingId,
  EnergyTypeId,
  urlToBuildingKorean,
} from "@/data/buildings";
import ReactECharts from "echarts-for-react";
import { useQueries } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { fetchEnergyRawData } from "@/lib/api/getEnergyRawData";
import { fetchEnergyPredictData } from "@/lib/api/getEnergyPredictData";

interface EnergyPageProps {
  building_ids: number[];
  energy_ids: number[];
  startTime?: Date;
  endTime?: Date;
  showPredictData?: boolean; // 예측 데이터 표시 여부
  label?: string; // 그래프 제목
}

// ECharts 시리즈 데이터 타입 정의
interface SeriesItem {
  name: string; // 시리즈 이름
  data: number[]; // 데이터 값 배열
  type: "line" | "bar" | "scatter" | "pie"; // 차트 타입
  smooth?: boolean; // 선을 부드럽게 할지 여부
  lineStyle?: {
    type?: "solid" | "dashed" | "dotted"; // 선 스타일
  };
  markLine?: {
    lineStyle?: {
      type?: "solid" | "dashed" | "dotted";
    };
    data: Array<{
      xAxis?: string | number;
      yAxis?: string | number;
      type?: string;
      value?: number;
      name?: string;
      label?: {
        show?: boolean;
        formatter?: string;
        position?: string;
      };
    }>;
  };
}

const EnergyChart: React.FC<EnergyPageProps> = ({
  building_ids,
  energy_ids,
  startTime,
  endTime,
  showPredictData = false,
  label,
}) => {
  // 웹소켓 연동
  useWebSocket();

  // 이상치 필터링 상태
  const [removeOutliers, setRemoveOutliers] = useState(true);

  // 쿼리 생성 부분: rawdata는 fetchEnergyRawData, predictdata는 fetchEnergyPredictData 사용
  const queries = building_ids
    .flatMap((building_id) =>
      energy_ids.map((energy_id) => {
        const buildingName = BuildingId[Number(building_id)];
        const energyTypeName = EnergyTypeId[energy_id];
        const baseQuery = {
          queryKey: [
            "buildingRawData",
            buildingName,
            energyTypeName,
            startTime,
            endTime,
          ],
          queryFn: () =>
            fetchEnergyRawData(
              buildingName,
              energyTypeName,
              startTime,
              endTime,
            ),
        };

        const qs = [baseQuery];
        const now = new Date();
        const after4Hours = new Date(now.setHours(now.getHours() + 4));

        if (showPredictData) {
          qs.push({
            queryKey: [
              "buildingPredictData",
              buildingName,
              energyTypeName,
              startTime,
            ],
            queryFn: async () =>
              fetchEnergyPredictData(
                buildingName,
                energyTypeName,
                startTime,
                after4Hours,
              ),
          });
        }

        return qs;
      }),
    )
    .flat();

  const queryResults = useQueries({ queries });
  const isLoading = queryResults.some((query) => query.isLoading);

  if (isLoading) {
    console.log("로딩 중...");
  }

  // const dataResults = queryResults.map((query) => query.data || []);

  const resultsWithKeys = queries.map((query, index) => {
    const result = queryResults[index];
    return {
      ...result,
      queryKey: query.queryKey,
    };
  });

  // 타임 스탬프 생성
  const allTimeStamps = useMemo(() => {
    const timestampSet = new Set<string>();

    resultsWithKeys.forEach(({ data }) => {
      const dataPoints = Array.isArray(data) ? (data as DataPoint[]) : [];
      dataPoints.forEach((point: DataPoint) => {
        const adjustedDateTime: [number, number, number, number, number] = [
          ...point.dateTime,
        ];

        adjustedDateTime[1] = adjustedDateTime[1] - 1; // 월 값 조정

        const date = new Date(...adjustedDateTime);

        timestampSet.add(date.toLocaleString());
      });
    });

    return Array.from(timestampSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }, [resultsWithKeys]);

  // 시리즈 데이터 생성: rawdata와 predictdata를 구분하여 각각 라인 생성

  const series = useMemo(() => {
    const seriesList: SeriesItem[] = [];

    resultsWithKeys.forEach(({ data, queryKey }) => {
      const today = new Date();
      const min = today.getMinutes() % 10;
      if (min !== 0) {
        today.setMinutes(today.getMinutes() - min);
      }

      const dataPoints = data as DataPoint[];
      const [type, buildingName] = queryKey as [string, string, string];

      if (!dataPoints || dataPoints.length === 0) {
        if (
          type === "buildingRawData" &&
          dataPoints &&
          dataPoints.length === 0
        ) {
          console.log("buildingRawData 데이터가 비어있어 시리즈에서 제외됨.");
        }
        return;
      }

      let name: string;
      if (type === "buildingRawData") {
        // raw data 시리즈 이름
        name = urlToBuildingKorean[buildingName];
      } else if (type === "buildingPredictData") {
        // predict data 시리즈 이름
        const originalName = buildingName.replace("_PREDICT", "");
        name = `${urlToBuildingKorean[originalName]} - 예측`;
      } else {
        name = "Unknown series";
      }

      const valueMap: { [key: string]: number } = {};
      dataPoints.forEach((point: DataPoint) => {
        const adjustedDateTime: [number, number, number, number, number] = [
          ...point.dateTime,
        ];
        adjustedDateTime[1] = adjustedDateTime[1] - 1; // 월 값 조정
        const date = new Date(...adjustedDateTime);

        const value = point.value;
        if (removeOutliers && (value >= 1000 || value <= 0)) {
          return; // 이상치 제거
        }

        valueMap[date.toLocaleString()] = value;
      });

      const seriesData = allTimeStamps.map(
        (timestamp) => valueMap[timestamp] || 0,
      );

      seriesList.push({
        name: name,
        data: seriesData,
        type: "line",
        smooth: true,
        lineStyle: {
          type: "solid",
        },
        markLine: {
          lineStyle: {
            type: "solid",
          },
          data: [{ xAxis: today.toLocaleString() }],
        },
      });
    });

    return seriesList;
  }, [resultsWithKeys, allTimeStamps, removeOutliers]);

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          type: "slider",
          start: 0,
          end: 100,
        },
      ],
      legend: {
        data: series.map((point) => point.name),
      },
      animation: "auto",
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          dataZoom: {
            title: {
              zoom: "확대",
              back: "초기화",
            },
          },
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: allTimeStamps,
      },
      yAxis: {
        type: "value",
      },
      series: series,
    }),
    [series, allTimeStamps],
  );

  return (
    <div className="flex flex-col">
      {label && (
        <h2 className="text-lg text-pretty font-semibold text-gray-700 mb-4">
          {label}
        </h2>
      )}
      <label className="mb-4">
        <input
          type="checkbox"
          checked={removeOutliers}
          onChange={() => setRemoveOutliers(!removeOutliers)}
          className="mr-2"
        />
        이상치 제거
      </label>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "324px" }}
      />
    </div>
  );
};

export default EnergyChart;

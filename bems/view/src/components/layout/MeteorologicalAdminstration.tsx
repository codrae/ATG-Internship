"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

// 날씨 데이터 타입 정의
interface WeatherItem {
  category: string;
  fcstValue: string;
  fcstDate: string;
  fcstTime: string;
}

interface WeatherApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item?: WeatherItem[];
      };
    };
  };
}

// 날씨 조건별 배경 이미지 매핑
const backgroundImageMap: { [key: string]: string } = {
  "(0,0,0)": "/images/weather/clear.png", // 맑음, 강수 없음
  "(0,3,0)": "/images/weather/cloud.png", // 구름 조금
  "(2,3,0)": "/images/weather/cloudy.png", // 구름 많음
  "(0,4,1)": "/images/weather/rainy.png", // 비
  "(2,4,1)": "/images/weather/shower.png", // 소나기 (흐림 + 비)
  "(0,4,3)": "/images/weather/snowy.png", // 눈
  "(2,4,3)": "/images/weather/snowy.png", // 흐림 + 눈
  "(0,4,2)": "/images/weather/thunder.png", // 천둥번개
  "(2,4,2)": "/images/weather/thunder.png", // 흐림 + 천둥번개
  "(0,0,1)": "/images/weather/foggy.png", // 안개
  "(2,3,1)": "/images/weather/night.png", // 맑은 밤
  "(2,3,2)": "/images/weather/nightcloudy.png", // 구름 많은 밤
  default: "/images/weather/clear.png", // 기본 이미지
};

// 가장 가까운 시간 데이터를 찾는 함수
const getClosestData = (
  items: WeatherItem[],
  category: string,
): WeatherItem | undefined => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}00`; // HH00 형식

  return items
    .filter((item) => item.category === category)
    .sort((a, b) => {
      const aDiff = Math.abs(
        parseInt(a.fcstTime, 10) - parseInt(currentTime, 10),
      );
      const bDiff = Math.abs(
        parseInt(b.fcstTime, 10) - parseInt(currentTime, 10),
      );
      return aDiff - bDiff;
    })
    .shift();
};

// 조건 키 생성 함수
const getWeatherConditionKey = (
  temperature: number,
  sky: string,
  precipitation: string,
): string => {
  const tempCondition = temperature <= 10 ? "0" : temperature >= 38 ? "1" : "2";
  return `(${tempCondition},${sky},${precipitation})`;
};

const WeatherForecast: React.FC = () => {
  const { data, error, isLoading, refetch } = useQuery<WeatherApiResponse>({
    queryKey: ["weatherForecast"],
    queryFn: async () => {
      const response = await fetch("/api/MeteorologicalAdminstration");
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      return response.json();
    },
  });

  if (isLoading) return <p>날씨 정보를 불러오는 중입니다...</p>;
  if (error || !data) {
    console.error(`[ERROR] Query failed:`, error);
    return <p>날씨 정보를 가져오지 못했습니다.</p>;
  }

  // API 응답 데이터 검증
  const weatherItems = data?.response?.body?.items?.item || [];
  if (weatherItems.length === 0) {
    return <p>날씨 데이터가 없습니다.</p>;
  }

  // 가장 가까운 시간의 날씨 정보 가져오기
  const closestTemperature =
    getClosestData(weatherItems, "TMP")?.fcstValue || "N/A";
  const closestSkyCondition =
    getClosestData(weatherItems, "SKY")?.fcstValue || "N/A";
  const closestPrecipitationType =
    getClosestData(weatherItems, "PTY")?.fcstValue || "N/A";

  // 조건 키 생성 및 배경 이미지 결정
  const conditionKey = getWeatherConditionKey(
    parseFloat(closestTemperature),
    closestSkyCondition,
    closestPrecipitationType,
  );

  const backgroundImage =
    backgroundImageMap[conditionKey] || backgroundImageMap["default"];

  return (
    <div
      className="relative w-full h-[150px] rounded-lg shadow-lg"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 상단 왼쪽: 지역 */}
      <div className="absolute top-2 left-1 z-10 text-white font-semibold text-xs">
        인천광역시 미추홀구
      </div>

      {/* 상단 오른쪽: 새로고침 버튼 */}
      <button
        onClick={() => refetch()}
        className="absolute top-2 right-2 z-20 text-white p-2 rounded-full text-xs hover:bg-gray-500 hover:scale-110 transition-transform transform duration-200 ease-in-out"
      >
        ⟳
      </button>

      {/* 중앙: 기온 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 text-white text-2xl font-bold">
        {closestTemperature}°C
      </div>

      {/* 하단 중앙: 날씨 상태 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 text-white text-sm">
        {closestSkyCondition === "1"
          ? "맑음"
          : closestSkyCondition === "3"
            ? "구름많음"
            : closestSkyCondition === "4"
              ? "흐림"
              : "알 수 없음"}
        {closestPrecipitationType === "0"
          ? ""
          : closestPrecipitationType === "1"
            ? " / 비"
            : closestPrecipitationType === "3"
              ? " / 눈"
              : ""}
      </div>
    </div>
  );
};

export default WeatherForecast;

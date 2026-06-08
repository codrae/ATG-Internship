"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
}

const Weather: React.FC = () => {
  const {
    data: weatherData,
    error,
    isLoading,
  } = useQuery<WeatherData>({
    queryKey: ["weatherData"],
    queryFn: async () => {
      const response = await fetch("/api/weather");
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return response.json();
    },
  });

  if (isLoading) return <p>날씨 정보를 불러오는 중입니다...</p>;
  if (error) return <p>날씨 정보를 가져오지 못했습니다.</p>;
  if (!weatherData) return <p>데이터를 불러오지 못했습니다.</p>;

  return (
    <div className="weather-container w-full max-w-xs p-4 text-black bg-gray-100">
      <h2 className="text-lg font-semibold mb-2">
        현재 날씨 - {weatherData.name}
      </h2>
      <p className="mb-1">온도: {weatherData.main.temp}°C</p>
      <p className="mb-1">습도: {weatherData.main.humidity}%</p>
      <p className="mb-2">날씨: {weatherData.weather[0].description}</p>
      <Image
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt="weather icon"
        layout="fill"
        className="mx-auto"
      />
    </div>
  );
};

export default Weather;

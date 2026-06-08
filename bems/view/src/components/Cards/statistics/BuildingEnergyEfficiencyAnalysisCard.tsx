/*
  건물 에너지 효율 분석(LLM) 카드
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Coins, Lightbulb, Loader, Recycle } from "lucide-react";
import React from "react";
import { idToEnergyKorean } from "@/data/buildings";
import Image from "next/image";

interface BuildingProps {
  building_id: number;
  energy_type: number;
}

function BuildingEnergyEfficiencyAnalysisCard({ energy_type }: BuildingProps) {
  const energy_type_name = idToEnergyKorean[energy_type];
  const now = new Date().toLocaleString();

  return (
    <Card>
      {/* 카드 대제목 */}
      <CardHeader className="flex-row justify-between items-center px-6 pb-2 w-full">
        <CardTitle className="text-left text-lg font-bold leading-7">
          건물 에너지 효율 분석
        </CardTitle>
        <CardDescription className="text-right text-sm font-normal leading-5">
          {now}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pb-0">
        <Card className="flex flex-row items-stretch justify-between p-4 w-full border-none shadow-none ">
          <div className="flex flex-col flex-1 p-0">
            <CardHeader className="flex flex-col w-full p-1 ">
              <CardTitle>
                <p className="text-sm font-normal leading-5 m-0">
                  현재 건물의 {energy_type_name} 사용량
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full px-1 pb-0 flex flex-col">
              <CardTitle className="p-0">
                <p className="text-lg font-bold leading-7 m-0">250 kWh</p>
                <p className="text-sm font-bold leading-5 text-red-500 m-0">
                  +32,000
                </p>
              </CardTitle>
            </CardContent>
          </div>

          <Separator
            orientation="vertical"
            className="h-16 w-px bg-gray-300 mx-4"
          />

          <div className="flex flex-col flex-1 p-0">
            <CardHeader className="flex flex-col w-full p-1">
              <CardTitle>
                <p className="text-sm font-normal leading-5 m-0">
                  시간대 평균 대비
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full px-1 pb-0 flex flex-col">
              <CardTitle>
                <p className="text-lg font-bold leading-7 m-0">15% 증가</p>
              </CardTitle>
            </CardContent>
          </div>
        </Card>
      </CardContent>
      <CardContent>
        <Button className="flex flex-row items-center justify-center gap-1 h-9 w-full rounded-md bg-[#38BDF8]  text-white">
          <Loader /> <p className="text-sm"> 재생성</p>
        </Button>
      </CardContent>
      {/* 내부 카드 */}
      {/*  현재 에너지 효율 등급 */}
      <CardContent className="flex flex-col bg-[#F1F5F9] pt-4 px-6 gap-2">
        <Card className="flex flex-col py-[10px] px-4 gap-1">
          <div className=" gap-1 text-start text-sky-300">
            <p className="flex flex-row items-center gap-1 text-sm font-bold ">
              <Recycle size={"16"} /> 에너지 효율 분석
            </p>
          </div>
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm">현재 건물 에너지 효율등급</p>
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-2xl">2등급</p>
              <div className="bg-green-500 text-white rounded-lg px-2 py-0.5">
                양호
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between text-sm">
            <p>단위면적당 에너지 사용량</p>
            <p>215 kWh/m²·년</p>
          </div>
          <div className="flex flex-row items-center justify-between text-sm">
            <p>외피 평균 열관류율</p>
            <p>0.68 W/m²·K</p>
          </div>
        </Card>

        {/*에너지 비용 분석*/}
        <Card className="flex flex-col py-[10px] px-4 gap-1">
          <div className=" gap-1 text-start text-amber-500">
            <p className="flex flex-row items-center gap-1 text-sm font-bold ">
              <Coins size={"16px"} />
              에너지 비용 분석
            </p>
          </div>
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm">월평균 에너지 비용</p>
            <p className="font-bold text-2xl">21,500,000원</p>
          </div>
          {/* 전기요금 % */}
          <div className="flex flex-row items-center text-sm gap-4">
            <Image
              src={"/images/icon/electric_pie_chart.svg"}
              alt={"electric_pie_chart"}
              width={46}
              height={46}
            />
            <div className="flex flex-col justify-start text-sm">
              <p>전기요금이</p>
              <p className="flex flex-row items-center gap-1">
                전체비용의
                <a className="text-green-600  font-bold text-lg">65%</a> 를
                차지합니다.
              </p>
            </div>
          </div>
          {/* 여름철 */}
          <div className="flex flex-row items-center justify-center py-1 text-sm bg-amber-100">
            <p className="text-amber-600 font-bold">여름철(6-8월) 냉방부하</p>
            <p>로 인한 비용 증가 뚜렷</p>
          </div>
        </Card>
        <p className="flex flex-row items-center justify-center gap-2 text-gray-700">
          <Lightbulb size="20px" color={"#38BDF8"} /> 현재 개선을 위한 제안
          드립니다.
        </p>
        <Card
          className={"flex flex-row items-center gap-2 px-4 py-[10px] text-sm"}
        >
          <p className={"text-sky-600"}>A. </p>
          <p>HVAC 시스템 운영 스케줄 최적화 필요</p>
          <p className={"text-sky-600 text-xs"}>예상 절감률 8%</p>
        </Card>
        <Card className={"flex flex-row gap-[10px] px-4 py-[10px]"}>
          <p className={"text-sky-600"}>B.</p>
          <p>HVAC 시스템 운영 스케쥴 최적화 필요</p>
        </Card>
        <Card className={"flex flex-row gap-[10px] px-4 py-[10px]"}>
          <p className={"text-sky-600"}>C.</p>
          <p>HVAC 시스템 운영 스케쥴 최적화 필요</p>
        </Card>
      </CardContent>
    </Card>
  );
}

export default BuildingEnergyEfficiencyAnalysisCard;

"use client";
import React from "react";
import MyEcharts from "@/components/Charts/MyEcharts";
import { Pie, PieData } from "@/components/Charts/options/Pie";
import AccordianCard from "@/components/Cards/AccordianCard";
import { BuildingEnergyNavigator } from "@/components/layout/BuildingEnergyNavigator";
import { Flame, Fuel, Zap, ZoomIn } from "lucide-react";
import { getProgressBarOption } from "@/components/Charts/options/ProgressBar";
import EnergySavingGoalProgress from "@/components/Charts/dashboard/EnergySavingGoalProgress";
import { PeriodEnergyCard } from "@/components/Cards/PeriodEnergyCard";

interface BuildingPageProps {
  params: {
    building_id: number;
    energy_type: number;
  };
}

const GoalManagementPage = ({ params }: BuildingPageProps) => {
  const { building_id } = params;

  // Mock Data
  const energySourceData: PieData[] = [
    { value: 60, name: "전기" },
    { value: 30, name: "열" },
    { value: 10, name: "가스" },
  ];

  const carbonEmissionData: PieData[] = [
    { value: 50, name: "전기" },
    { value: 35, name: "열" },
    { value: 15, name: "가스" },
  ];

  const progressOption = getProgressBarOption({
    progress: 37, // 목표 진행률
    barGradient: ["#4CAF50", "#C4E17F"], // 시작 색상과 끝 색상
    barWidth: 40,
  });

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* SubHeader */}
      <BuildingEnergyNavigator
        icon={<ZoomIn size={"20"} />}
        label="지표관리 / 목표관리"
        currentBuildingId={building_id}
      />

      {/* 아코디언 카드 */}
      <div className="mt-4 mb-6">
        <AccordianCard building_id={building_id} total_energy={1234} />
      </div>

      {/* 첫 번째 행: 1:4 비율 */}
      <div className="grid grid-cols-5 gap-6 mb-10">
        {/* 목표 대비 사용량 및 사용률 */}
        <div className="col-span-1 bg-white rounded-lg shadow p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-700">
            목표 대비 에너지 사용량 및 사용률
          </h3>
          <div>
            <div className="text-gray-500 text-sm mb-1">목표 대비 사용량</div>
            <div className="text-3xl font-bold text-blue-600">
              14,235 <span className="text-lg text-gray-400">TOE</span>
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">목표 대비 사용률</div>
            <div className="text-3xl font-bold text-green-500">37%</div>
          </div>
          <div className="h-16">
            <MyEcharts option={progressOption} style={{ height: "80px" }} />
            현재 누적 사용량 : 128.41 TOE
          </div>
        </div>

        {/* 에너지 사용량 차트 */}
        <div className="col-span-4 bg-white rounded-lg shadow p-6">
          <PeriodEnergyCard
            building_id={building_id}
            energy_type={1}
            isTable={false}
            isPeriodButton={false}
            isRetrainButton={false}
            startTime={oneMonthAgo}
            endTime={now} // 초기 기간 전달
            className={"flex flex-col w-full shadow-none border-none"}
          />
        </div>
      </div>

      {/* 두 번째 행: 1:1:1 비율 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 연간 절감 목표 실적 현황 */}
        <div className="bg-white rounded-lg shadow p-6">
          <EnergySavingGoalProgress />
        </div>

        {/* 에너지원별 사용 비율 */}
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-4">에너지원별 사용 비율</h3>
            <MyEcharts
              option={Pie(
                energySourceData,
                undefined, // Title
                undefined, // Subtitle
                ["#4CAF50", "#FF6F61", "#FFA500"],
                "/images/icon/pie-power.svg",
              )}
              style={{ width: "100%", height: "220px" }}
            />
          </div>
          <div className={"bg-slate-50 rounded-lg w-[252px] px-6 py-4"}>
            <div className={"flex flex-row items-center justify-between"}>
              <p
                className={
                  "flex flex-row items-center text-amber-300 text-base font-700"
                }
              >
                <Zap size={"16px"} /> 전기
              </p>
              <p className={"text-sm font-500 text-[#6B7280]"}>90 TOE</p>
              <p className={"text-base font-700"}> 60%</p>
            </div>
            <div className={"flex flex-row items-center justify-between"}>
              <p className={"flex flex-row text-rose-500 text-base font-700"}>
                <Flame size={"16px"} /> 열{" "}
              </p>
              <p className={"text-sm font-500 text-[#6B7280]"}>45 TOE</p>
              <p className={"text-base font-700"}> 30%</p>
            </div>
            <div className={"flex flex-row items-center justify-between"}>
              <p className={"flex flex-row text-indigo-500 text-base font-700"}>
                <Fuel size={"16px"} /> 가스{" "}
              </p>
              <p className={"text-sm font-500 text-[#6B7280]"}>15 TOE</p>
              <p> 10%</p>
            </div>
          </div>
        </div>

        {/* 에너지원별 탄소 배출 비율 */}
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-4">
              에너지원별 탄소 배출 비율
            </h3>
            <MyEcharts
              option={Pie(
                carbonEmissionData,
                undefined, // Title
                undefined, // Subtitle
                ["#3F51B5", "#FFC107", "#00BCD4"],
                "/images/icon/pie-co2.svg",
              )}
              style={{ width: "100%", height: "200px" }}
            />
          </div>
          <div className={"bg-slate-50 rounded-lg w-[252px] px-6 py-4"}>
            <div className={"flex flex-row items-center justify-between"}>
              <p
                className={
                  "flex flex-row items-center text-amber-300 text-base font-700"
                }
              >
                <Zap size={"16px"} /> 전기
              </p>
              <p className={"text-sm font-500 text-[#6B7280]"}>100 TOE</p>
              <p className={"text-base font-700"}> 50%</p>
            </div>
            <div className={"flex flex-row items-center justify-between"}>
              <p className={"flex flex-row text-rose-500 text-base font-700"}>
                <Flame size={"16px"} /> 열{" "}
              </p>
              <p className={"text-sm font-500 text-[#6B7280]"}>70 TOE</p>
              <p className={"text-base font-700"}> 35%</p>
            </div>
            <div className={"flex flex-row items-center justify-between"}>
              <p className={"flex flex-row text-indigo-500 text-base font-700"}>
                <Fuel size={"16px"} /> 가스{" "}
              </p>
              <p className={"text-sm font-500 text-[#6B7280]"}>30 TOE</p>
              <p> 15%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalManagementPage;

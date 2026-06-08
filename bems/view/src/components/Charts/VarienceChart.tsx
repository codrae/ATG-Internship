"use client";

// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import {Area, AreaChart, CartesianGrid} from "recharts";

const chartData = [
  { desktop: 186, mobile: 80 },
  { desktop: 305, mobile: 200 },
  { desktop: 237, mobile: 120 },
  { desktop: 73, mobile: 190 },
  { desktop: 209, mobile: 130 },
  { desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function VarianceChart() {
  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center px-6 pb-2 w-full">
        <CardTitle className="text-left text-lg font-bold leading-7">
          실시간 데이터 정보
        </CardTitle>
        <CardDescription className="text-right text-sm font-normal leading-5">
          이번달 기준
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center px-6 pb-6 flex-col gap-4">
        <Card className="flex flex-row items-stretch justify-between p-4 w-full border-none shadow-none ">
          <div className="flex flex-col flex-1 p-0">
            <CardHeader className="flex flex-col w-full p-1 ">
              <CardTitle>
                <p className="text-sm font-normal leading-5 m-0">
                  {" "}
                  현재 누적 사용량{" "}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full px-1 pb-0 flex flex-col">
              <CardTitle className="p-0">
                <p className="text-lg font-bold leading-7 m-0">2,450 kWh</p>
                <p className="text-sm font-bold leading-5 text-red-500 m-0">
                  +32000
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
                  시간당 평균 사용량
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full px-1 pb-0 flex flex-col">
              <CardTitle>
                <p className="text-lg font-bold leading-7 m-0">120 kwWh/h</p>
                <p className="text-sm font-bold leading-5 text-blue-500 m-0">
                  -11,000
                </p>
              </CardTitle>
            </CardContent>
          </div>
        </Card>

        <Card className="flex flex-row items-stretch justify-between p-4 w-full bg-[#F8FAFC] border-none shadow-none">
          <div className="flex flex-col flex-1 m-0 p-0">
            <CardHeader className="flex flex-col w-full m-0 p-1">
              <CardTitle className="m-0 p-0">
                <p className="text-sm font-normal leading-5 m-0">
                  최대 사용량 및 시간
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full px-1 pb-0 pt-0 flex flex-col">
              <CardTitle className="p-0 m-0">
                <p className="text-lg font-bold leading-7 m-0">120 kWh/h</p>
                <p className="flex items-center text-sm font-bold leading-5 text-red-500 m-0 before:content-['↑'] before:text-red-500 before:mr-1">
                  4.3%
                </p>
              </CardTitle>
            </CardContent>
          </div>

          <div className="flex flex-col flex-1 transform scale-y-75 h-[75px]">
            <ChartContainer config={chartConfig}>
              <AreaChart
                className="p-0 m-0 flex flex-col"
                accessibilityLayer
                data={chartData}
              >
                <CartesianGrid vertical={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="var(--color-mobile)"
                  fillOpacity={0.4}
                  stroke="var(--color-mobile)"
                  stackId="a"
                />
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
}

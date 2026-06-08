/*
   에너지 모니터링 - 에너지원별 페이지의 용도별 에너지 사용현황 카드
 */

"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "금일", light: 40, HVAC: 12, office: 12, etc: 12 },
  { date: "1일전", light: 40, HVAC: 12, office: 12, etc: 12 },
  { date: "2일전", light: 40, HVAC: 12, office: 12, etc: 12 },
];

const chartConfig = {
  light: {
    label: "조명",
    color: "#2563EB",
  },
  HVAC: {
    label: "HVAC",
    color: "#38BDF8",
  },
  office: {
    label: "사무기기",
    color: "#2DD4BF",
  },
  etc: {
    label: "기타",
    color: "#4ADE80",
  },
} satisfies ChartConfig;

export function SourceEnergyCard() {
  return (
    <Card className="min-w-full">
      <CardHeader className="flex-row justify-between items-center px-6 pb-2 w-full">
        <CardTitle className="text-left text-lg font-bold leading-7">
          용도별 에너지 사용 현황
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* todo: 높이 고정 수정 필요 */}
        <ChartContainer config={chartConfig} className="w-full h-[336px]">
          <BarChart accessibilityLayer data={chartData} className="h-full">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-base text-grey-600"
            />
            {/*<ChartTooltip content={<ChartTooltipContent hideLabel />} />*/}
            <ChartLegend
              verticalAlign={"top"}
              content={<ChartLegendContent />}
            />
            <Bar
              dataKey="light"
              stackId="a"
              fill="var(--color-light)"
              radius={[0, 0, 4, 4]}
            >
              <LabelList
                dataKey="light"
                position="center"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
              {/*  todo: 비율값을 계산한뒤 content 필드로 넣어줄 예정 */}
            </Bar>
            <Bar
              dataKey="HVAC"
              stackId="a"
              fill="var(--color-HVAC)"
              radius={[0, 0, 0, 0]}
            >
              <LabelList
                dataKey="HVAC"
                position="center"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
            </Bar>

            <Bar
              dataKey="office"
              stackId="a"
              fill="var(--color-office)"
              radius={[0, 0, 0, 0]}
            >
              <LabelList
                dataKey="office"
                position="center"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="etc"
              stackId="a"
              fill="var(--color-etc)"
              radius={[0, 0, 0, 0]}
            >
              <LabelList
                dataKey="etc"
                position="center"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

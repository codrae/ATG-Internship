"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "7월", desktop: 186 },
  { month: "8월", desktop: 305 },
  { month: "9월", desktop: 237 },
  { month: "10월", desktop: 73 },
  { month: "11월", desktop: 209 },
  { month: "12월", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BarExComponent() {
  return (
    <ChartContainer className={"h-[118px]"} config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="desktop" fill="#38BDF8" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}

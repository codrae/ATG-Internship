/*
    금일 에너지 총 사용량/누적요금 카드 생성 컴포넌트
 */

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { MoveDown, MoveUp } from "lucide-react";
import formatWithCommas from "@/utils/formatWithcommas";

interface InnerCardProps {
  label: string;
  content: React.ReactNode;
  unit?: string;
  usageValue: number | string;
  comparisonValue: number;
  boxColor?: "bg-sky-100" | "bg-red-100";
  comment: string;
  suffix?: "사용";
}

export const TodayUsageInnerCard: React.FC<InnerCardProps> = ({
  label,
  content,
  unit,
  usageValue,
  comparisonValue,
  boxColor = "bg-sky-100",
  comment,
  suffix,
}) => {
  let diff = 0;
  let ratio = 0;
  if (typeof usageValue === "number") {
    diff = usageValue - comparisonValue;
    ratio = Math.round(diff / comparisonValue) * 100;
  }

  return (
    <span>
      <CardHeader>
        <CardTitle className="text-left text-lg font-bold leading-7">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-6">
        {content}

        {typeof usageValue === "number" && (
          <div className="flex flex-col h-full">
            <div className="text-3xl font-bold">
              {formatWithCommas({ value: usageValue, divider: 1, label: unit })}
            </div>

            <div className="text-base font-bold">
              {diff >= 0 ? (
                <p className="text-red-500"> {diff}</p>
              ) : (
                <p className="text-blue-500"> {diff}</p>
              )}
            </div>

            {diff >= 0 && !suffix ? (
              <div
                className={`text-sm font-medium p-2 mt-4 rounded-md ${boxColor}`}
              >
                {comment} {ratio} % 증가 <MoveUp />
              </div>
            ) : diff <= 0 && !suffix ? (
              <div
                className={`text-sm font-medium p-2 mt-4 rounded-md ${boxColor}`}
              >
                {comment} {ratio} % 감소 <MoveDown />
              </div>
            ) : (
              <div
                className={`text-sm font-medium p-2 mt-4 rounded-md ${boxColor}`}
              >
                {comment} {ratio} % {suffix}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </span>
  );
};

/*
  상태 정보 아코디언 박스에 사용되는 InfoCard 컴포넌트
 */

import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  label,
  value,
  description,
}) => {
  return (
    <Card className="flex flex-col max-h-full rounded-lg bg-white">
      <CardHeader className="flex flex-row h-full items-center justify-between space-y-0 px-4 pt-4 pb-0 gap-4">
        <div className="flex flex-row items-center gap-1 text-base font-medium flex-shrink-0">
          {icon} {label}
        </div>
        <CardTitle className="text-2xl font-bold flex-1 text-right truncate">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-4">
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default InfoCard;

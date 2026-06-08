import { Button } from "@/components/ui/button";
import { CircleAlert, CircleCheck } from "lucide-react";
import React, { ReactNode } from "react";

interface EnergyStatusButtonProps {
  buildingId: number;
  energyTypeId: number;
  label: string;
  labelColor?: string;
  icon?: ReactNode;
  isTotal?: boolean;
  isAlert?: boolean; // 최근 이상치 발생 여부
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// eslint-disable-next-line react/display-name
export const EnergyStatusButton = React.forwardRef<
  HTMLButtonElement,
  EnergyStatusButtonProps
>(
  (
    {
      label,
      labelColor,
      icon,
      isTotal = false,
      isAlert = false,
      variant = "secondary",
      onClick,
    },
    ref,
  ) => {
    if (isTotal) {
      return (
        <Button
          ref={ref}
          className="bg-white flex items-center justify-center p-4 h-full w-full shadow-none border"
          variant={variant}
          onClick={onClick}
        >
          전체
        </Button>
      );
    }
    return (
      <Button
        ref={ref}
        className={`bg-white flex flex-row items-center justify-between p-4 h-full w-full shadow-none border ${labelColor}`}
        variant={variant}
        onClick={onClick}
      >
        <div className={`flex flex-row items-center gap-2`}>
          {icon} {label}
        </div>
        {isAlert ? (
          <div className="flex flex-row items-center gap-2">
            <CircleAlert className="text-red-500" />
            <p className="text-red-500">이상치 발생</p>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2">
            <CircleCheck className="text-blue-600" />
            <p className="text-blue-600">정상</p>
          </div>
        )}
      </Button>
    );
  },
);

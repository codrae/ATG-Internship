"use client";

import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";

interface CustomButtonProps {
  text: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(
  (
    {
      text,
      icon,
      iconPosition = "left",
      className,
      variant = "secondary", // 버튼 호버 반응
      onClick,
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        className={`px-3 py-2 gap-1 text-gray-700 text-sm leading-5 font-medium ${className}`}
        variant={variant}
        onClick={onClick}
      >
        {iconPosition === "left" && icon}
        {text}
        {iconPosition === "right" && icon}
      </Button>
    );
  },
);

CustomButton.displayName = "CustomButton";

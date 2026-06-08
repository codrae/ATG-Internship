"use client";

import React, { useEffect, useState } from "react";

interface SidebarGroupProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ children, className }) => {
  return (
    <div className={`p-4 bg-gray-100 rounded-md shadow ${className}`}>
      {children}
    </div>
  );
};

const SidebarGroupWithTime: React.FC = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const updateCurrentDateTime = () => {
      const now = new Date();
      setCurrentDate(formatDate(now));
      setCurrentTime(formatTime(now));
    };

    updateCurrentDateTime();
    const interval = setInterval(updateCurrentDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarGroup className="px-4 rounded-[99px] flex flex-col justify-start items-center">
      <div className="flex justify-center w-full overflow-hidden">
        <div className="text-center text-slate-700 text-xl font-normal font-['Pretendard'] leading-7 whitespace-nowrap">
          {currentDate}
        </div>
      </div>
      <div className="flex justify-center w-full overflow-hidden">
        <div className="text-center text-slate-700 text-xl font-bold font-['Pretendard'] leading-7 whitespace-nowrap">
          {currentTime}
        </div>
      </div>
    </SidebarGroup>
  );
};

export default SidebarGroupWithTime;

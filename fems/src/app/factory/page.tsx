// 전체 공장에 대한 모니터링 페이지
// src/app/page.tsx
import React from "react";
import OverallStatusComponent from "@/components/factory/OverallStatusComponent";
import RecentAlertLogComponent from "@/components/alerts/RecentAlarmLog";
import SettingsButton from "@/components/factory/settingsButton";
import Factory2DTwin from "@/components/factory/mornitoring";

const HomePage = () => {
  const logs = [
    "Factory 3 - sensor 2 - 경고",
    "Factory 3 - sensor 3 - 경고",
    "Factory 5 - sensor 1 - 알람",
  ];

  return (
    <div>
      <div className="grid grid-cols-[3fr_1fr] gap-4 ">
        <div>
          <Factory2DTwin />
        </div>
        <div className="flex flex-col items-center justify-center gap-12 p-0 h-full">
          {/* Overall Status */}
          <OverallStatusComponent total={100} good={80} bad={13} warning={7} />

          {/* Recent Alerts */}
          <RecentAlertLogComponent logs={logs} />

          {/* Settings Button */}
          <SettingsButton />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

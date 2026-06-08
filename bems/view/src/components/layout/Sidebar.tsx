"use client";

import Weather from "@/components/layout/weather";
import { MdOutlineDashboard, MdOutlineNavigateNext } from "react-icons/md";
import SidebarItem from "./SidebarItem";
import { useAtom } from "jotai";
import { sidebarOpenMenuAtom } from "@/atoms/sidebarAtom";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname(); // 현재 경로 가져오기
  const [openMenu, setOpenMenu] = useAtom(sidebarOpenMenuAtom); // jotai 상태 사용

  // 열려 있는 메뉴 상태를 토글하는 함수
  const toggleMenu = (menu: string, defaultLink?: string) => {
    if (openMenu === menu) {
      setOpenMenu(null); // 메뉴 닫기
    } else {
      setOpenMenu(menu); // 메뉴 열기
      if (defaultLink && typeof window !== "undefined") {
        window.location.href = defaultLink; // 첫 번째 하위 항목으로 이동
      }
    }
  };

  // 활성화 상태를 판단하는 함수
  const isActive = (path: string) => {
    const regex = new RegExp(path);
    return regex.test(pathname);
  };

  // 정규식 상수로 관리
  const regexPatterns = {
    monitoringBuildingOnly: "^\\/monitoring\\/[^\\/]+\\/?$", // building_id만 있는 경우
    monitoringBuildingAndEnergy: "^\\/monitoring\\/[^\\/]+\\/[^\\/]+\\/?$", // building_id와 energy_type이 모두 있는 경우
  };

  return (
    <aside className="flex flex-col h-full">
      <nav className="flex-1 p-6 overflow-auto">
        <ul className="space-y-4">
          <SidebarItem
            icon={<MdOutlineDashboard />}
            label="대시보드"
            href="/dashboard"
            isActive={isActive("/dashboard")}
          />
          <li>
            {/* 에너지 모니터링 */}
            <div onClick={() => toggleMenu("에너지 모니터링", "/monitoring/1")}>
              <SidebarItem
                label="에너지 모니터링"
                href="#"
                isActive={isActive("/monitoring/")}
              />
            </div>
            {(openMenu === "에너지 모니터링" || isActive("/monitoring")) && (
              <ul className="pl-6 mt-2 space-y-2">
                <SidebarItem
                  icon={<MdOutlineNavigateNext />}
                  label="전체 에너지"
                  href="/monitoring/1"
                  isActive={isActive(regexPatterns.monitoringBuildingOnly)}
                />
                <SidebarItem
                  icon={<MdOutlineNavigateNext />}
                  label="에너지원별"
                  href="/monitoring/1/1"
                  isActive={isActive(regexPatterns.monitoringBuildingAndEnergy)}
                />
              </ul>
            )}
          </li>
          <SidebarItem
            label="에너지 통계"
            href="/statistics/1/1"
            isActive={isActive("/statistics/1/1")}
          />
          <li>
            {/* 지표 관리 */}
            <div onClick={() => toggleMenu("지표 관리", "/management/unit/1")}>
              <SidebarItem
                label="지표 관리"
                href="#"
                isActive={isActive("/management/")}
              />
            </div>
            {(openMenu === "지표 관리" || isActive("/management")) && (
              <ul className="pl-6 mt-2 space-y-2">
                <SidebarItem
                  icon={<MdOutlineNavigateNext />}
                  label="원단위"
                  href="/management/unit/1"
                  isActive={isActive("/management/unit")}
                />
                <SidebarItem
                  icon={<MdOutlineNavigateNext />}
                  label="목표관리"
                  href="/management/goal/1"
                  isActive={isActive("/management/goal")}
                />
              </ul>
            )}
          </li>
          <SidebarItem
            label="알람"
            href="/alerts"
            isActive={isActive("/alerts")}
          />
          <SidebarItem
            label="설정"
            href="/settings"
            isActive={isActive("/settings")}
          />
        </ul>
      </nav>
      <Weather />
    </aside>
  );
}

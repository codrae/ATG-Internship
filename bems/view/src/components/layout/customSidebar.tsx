"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import SidebarGroupWithTime from "@/components/layout/SidebarGroupWithTime";
import WeatherImage from "@/components/layout/MeteorologicalAdminstration";

// 메뉴 아이템 데이터 타입 정의
interface SubMenuItem {
  title: string;
  url: string;
  matchPattern?: string;
}

interface MenuItem {
  title: string;
  url?: string;
  icon?: string;
  matchPattern?: string;
  subMenu?: SubMenuItem[];
  collapsible?: boolean; // 추가: 메뉴의 토글 가능 여부
}

// 메뉴 아이템 데이터
const menuItems: MenuItem[] = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: "/images/icon/dashboard-icon.svg",
  },
  {
    title: "에너지 모니터링",
    icon: "/images/icon/monitoring-icon.svg",
    collapsible: false, // 토글 없이 서브메뉴를 항상 표시
    subMenu: [
      {
        title: "전체 에너지",
        url: "/monitoring/1",
        matchPattern: "^/monitoring/[^/]+$", // 경로 검증용 정규식
      },
      {
        title: "에너지원별",
        url: "/monitoring/1/1",
        matchPattern: "^/monitoring/[^/]+/[^/]+$", // 경로 검증용 정규식
      },
    ],
  },
  {
    title: "에너지 통계",
    url: "/statistics/1/1",
    icon: "/images/icon/analyze-icon.svg",
  },
  {
    title: "지표 관리",
    icon: "/images/icon/management-icon.svg",
    collapsible: false, // 토글 없이 서브메뉴를 항상 표시
    subMenu: [
      {
        title: "원단위",
        url: "/management/unit/1",
        matchPattern: "^/management/unit",
      },
      {
        title: "목표관리",
        url: "/management/goal/1",
        matchPattern: "^/management/goal",
      },
    ],
  },
  {
    title: "설정",
    url: "/settings",
    icon: "/images/icon/setting-icon.svg",
  },
];

const CustomSidebar = () => {
  const pathname = usePathname(); // 현재 경로 가져오기

  // 활성화 상태를 판단하는 함수
  const isActive = (
    url: string | undefined,
    matchPattern?: string,
  ): boolean => {
    if (matchPattern) {
      const regex = new RegExp(matchPattern);
      return regex.test(pathname);
    } else if (url) {
      return pathname === url;
    } else {
      return false;
    }
  };

  return (
    <Sidebar className="flex-grow max-h-screen">
      {/* 헤더 */}
      <SidebarHeader>INHA BEMS</SidebarHeader>

      {/* 메인 컨텐츠 */}
      <SidebarContent className="min-h-screen">
        <SidebarGroupWithTime />
        <SidebarGroup>
          {/*<Weather /> /!*TODO : 날씨 정보 전역으로 설정*!/*/}
          <WeatherImage />
        </SidebarGroup>
        {/* Application 그룹 */}
        <SidebarGroup>
          <SidebarGroupLabel>MAIN MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.subMenu) {
                  if (item.collapsible === false) {
                    // 토글 없이 항상 서브메뉴를 표시하는 경우
                    return (
                      <React.Fragment key={item.title}>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            className={
                              item.subMenu.some((subItem) =>
                                isActive(subItem.url, subItem.matchPattern),
                              )
                                ? "bg-gray-200 text-blue-600"
                                : ""
                            }
                          >
                            {item.icon && (
                              <Image
                                src={item.icon}
                                alt={item.title}
                                width={20}
                                height={20}
                                className="mr-2 filter-blue"
                              />
                            )}
                            {item.title}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuSub>
                          {item.subMenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuButton
                                asChild
                                className={
                                  isActive(subItem.url, subItem.matchPattern)
                                    ? "bg-gray-200 text-blue-600"
                                    : ""
                                }
                              >
                                <a href={subItem.url}>{subItem.title}</a>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </React.Fragment>
                    );
                  } else {
                    // 기본적으로 Collapsible 메뉴로 처리
                    return (
                      <Collapsible
                        key={item.title}
                        defaultOpen={item.subMenu.some((subItem) =>
                          isActive(subItem.url, subItem.matchPattern),
                        )}
                        className="group/collapsible"
                      >
                        {/* Collapsible 메뉴 */}
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              className={
                                item.subMenu.some((subItem) =>
                                  isActive(subItem.url, subItem.matchPattern),
                                )
                                  ? "bg-gray-200 text-blue-600"
                                  : ""
                              }
                            >
                              {item.icon && (
                                <Image
                                  src={item.icon}
                                  alt={item.title}
                                  width={20}
                                  height={20}
                                  className="mr-2 filter-blue"
                                />
                              )}
                              {item.title}
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subMenu.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuButton
                                    asChild
                                    className={
                                      isActive(
                                        subItem.url,
                                        subItem.matchPattern,
                                      )
                                        ? "bg-gray-200 text-blue-600"
                                        : ""
                                    }
                                  >
                                    <a href={subItem.url}>{subItem.title}</a>
                                  </SidebarMenuButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                } else {
                  // 서브메뉴가 없는 경우
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={
                          isActive(item.url, item.matchPattern)
                            ? "bg-gray-200 text-blue-600"
                            : ""
                        }
                      >
                        <a href={item.url}>
                          {item.icon && (
                            <Image
                              src={item.icon}
                              alt={item.title}
                              width={20}
                              height={20}
                              className="mr-2 filter-blue"
                            />
                          )}
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default CustomSidebar;

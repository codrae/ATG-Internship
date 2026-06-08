"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const buildings = [
  { id: 1, name: "1호관", link: "/monitoring/3/1" },
  { id: 2, name: "5호관", link: "/monitoring/2/1" },
  { id: 3, name: "하이테크센터", link: "/monitoring/1/1" },
  { id: 4, name: "정석학술정보관", link: "/monitoring/4/1" },
  { id: 5, name: "인하드림센터", link: "/monitoring/5/1" }, // 인하드림센터 추가
];

export default function BuildingNavigationMenu() {
  return (
    <div className="absolute top-4 right-4">
      <NavigationMenu>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white px-4 py-2 rounded-full shadow-md border text-gray-700">
            건물 네비게이션
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white rounded-lg shadow-md border p-2">
            {buildings.map((building) => (
              <NavigationMenuLink asChild key={building.id}>
                <Link
                  href={building.link}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md whitespace-nowrap"
                >
                  {building.name}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  );
}

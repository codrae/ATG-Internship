import React from "react";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import Link from "next/link";

interface SidebarItemProps {
  icon?: React.ReactNode; // 아이콘 컴포넌트 (기본값 적용)
  label: string; // 텍스트 라벨
  href: string; // 이동할 링크
  isActive?: boolean; // 활성화 상태
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon = <MdCheckBoxOutlineBlank />, // 기본 아이콘
  label,
  href,
  isActive,
}) => {
  return (
    <div
      className={`text-xs flex items-center gap-2 cursor-pointer ${
        isActive ? "text-blue-500 font-semibold" : "text-gray-700"
      } hover:text-blue-500`}
    >
      <Link href={href} className="flex items-center gap-2 w-full">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </Link>
    </div>
  );
};

export default SidebarItem;

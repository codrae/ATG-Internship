"use client";

import Link from "next/link";
import Image from "next/image";
import AlarmDropdown from "@/components/Alarm/AlarmHeaderComponent";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 w-full z-50">
      <div className="flex items-center justify-between px-6 py-2 h-[62px]">
        {/* 로고 영역 */}
        <Link
          href="/dashboard"
          className="text-gray-900 text-2xl font-semibold font-['Pretendard']"
        >
          INHA BEMS
        </Link>
        <div className="flex items-center justify-between gap-16">
          {/* 알림 메시지 영역 */}
          <AlarmDropdown />
          {/* 사용자 프로필 */}
          <Image
            src={"/images/icon/User.svg"}
            alt="User Icon"
            width={28}
            height={28}
            className="cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}

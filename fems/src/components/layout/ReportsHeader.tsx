"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const ReportsHeader: React.FC<{ maxReportsId: string }> = ({
  maxReportsId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const maxId = Number(maxReportsId);

  // 현재 reportsId 상태를 URL에서 추출하여 관리
  const [currentId, setCurrentId] = useState<number>(1);

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const idSegment = pathSegments[pathSegments.length - 1];

    if (pathname === "/") {
      setCurrentId(1);
    } else {
      const id = Number(idSegment);
      if (!isNaN(id)) {
        setCurrentId(id);
      }
    }
  }, [pathname]);

  // 다음 report_id로 이동하는 함수
  const handleNext = () => {
    const nextId = currentId < maxId ? currentId + 1 : 1;
    const nextPath = `/factory/process/${nextId}/reports`;

    if (pathname !== nextPath) {
      router.push(nextPath);
    }
  };

  // 이전 report_id로 이동하는 함수
  const handlePrevious = () => {
    const previousId = currentId > 1 ? currentId - 1 : maxId;
    const previousPath = `/factory/process/${previousId}/reports`;

    if (pathname !== previousPath) {
      router.push(previousPath);
    }
  };

  // 홈 화면으로 이동하는 함수
  const handleHome = () => {
    if (pathname !== "/factory") {
      router.push("/factory");
    }
  };

  return (
    <header className="bg-[#8497B0] text-white italic mb-5 text-2xl p-8 flex items-center justify-between">
      {/* 왼쪽 버튼이나 빈 공간 */}
      {pathname !== "/" ? (
        <button onClick={handlePrevious} className="text-white text-xl">
          {"<"}
        </button>
      ) : (
        <div className="w-6" /> // 중앙 정렬을 위한 빈 공간
      )}

      {/* 제목 */}
      <h1 onClick={handleHome} className="flex-1 text-center cursor-pointer">
        Vibration Report - Analysis Result Simmtech
      </h1>

      {/* 오른쪽 버튼이나 빈 공간 */}
      {pathname !== "/" ? (
        <button onClick={handleNext} className="text-white text-xl">
          {">"}
        </button>
      ) : (
        <div className="w-6" /> // 중앙 정렬을 위한 빈 공간
      )}
    </header>
  );
};

export default ReportsHeader;

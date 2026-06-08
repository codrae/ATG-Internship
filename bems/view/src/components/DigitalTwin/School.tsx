"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BuildingNavigationMenu from "@/components/DigitalTwin/BuildingNavigationMenu";
import { buildingInfo, BuildingKey } from "@/data/buildings"; // Next.js 13의 app 디렉토리에서 사용

const School = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingKey | null>(
    null,
  );

  const router = useRouter(); // 라우터 초기화

  return (
    <>
      <div className="relative w-full h-[600px] max-w-[900px] mx-auto">
        {/* 우측 상단 네비게이션 버튼 */}
        <BuildingNavigationMenu />
        <Image
          src="/images/building/campusMap.jpg"
          alt="Campus Map"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg shadow-lg object-contain"
        />
        {/* 건물 포인터 */}
        {Object.keys(buildingInfo).map((key) => {
          const buildingKey = key as BuildingKey;
          const building = buildingInfo[buildingKey];
          const positionClasses = getPositionClasses(buildingKey);

          return (
            <div
              key={buildingKey}
              className={`absolute ${positionClasses} cursor-pointer`}
              onMouseEnter={() => setSelectedBuilding(buildingKey)}
              onMouseLeave={() => setSelectedBuilding(null)}
              onClick={() => router.push(building.monitorLink)}
            >
              {/* 포인터 이미지 변경 */}
              <Image
                src={
                  selectedBuilding === buildingKey
                    ? "/images/icon/pin-red.svg"
                    : "/images/icon/pin.svg"
                }
                alt="Building Pointer"
                width={24}
                height={24}
                className="transition-transform duration-200 ease-in-out transform hover:scale-110"
              />

              {/* 오버레이 */}
              {selectedBuilding === buildingKey && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white p-4 rounded-lg shadow-lg z-10"
                  onMouseEnter={() => setSelectedBuilding(buildingKey)}
                  onMouseLeave={() => setSelectedBuilding(null)}
                >
                  <h2 className="text-xl font-bold mb-2">{building.name}</h2>
                  <Image
                    src={building.imageSrc}
                    alt={building.name}
                    width={300}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                  <div className="grid grid-cols-2 gap-4 text-left text-sm mb-4">
                    <div>
                      <strong>건물 유형:</strong>
                      <span> 교육 및 연구</span>
                    </div>
                    <div>
                      <strong>연면적:</strong>
                      <span> {building.area}</span>
                    </div>
                    <div>
                      <strong>건물 규모:</strong>
                      <span> {building.floors}</span>
                    </div>
                    <div>
                      <strong>완공:</strong>
                      <span> {building.yearBuilt}</span>
                    </div>
                  </div>
                  <p className="mb-4">{building.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

// 각 건물의 위치 클래스를 반환하는 함수
function getPositionClasses(buildingKey: BuildingKey): string {
  switch (buildingKey) {
    case "high-tech-center":
      return "top-[15%] left-[76%]";
    case "building-1":
      return "top-[38%] left-[55%]";
    case "anniversary-memorial-hall":
      return "top-[18%] left-[47%]";
    case "law-school-building":
      return "top-[60%] left-[33%]";
    case "inha-dream-center-2-3":
      return "top-[21%] left-[85%]";

    default:
      return "";
  }
}

export default School;

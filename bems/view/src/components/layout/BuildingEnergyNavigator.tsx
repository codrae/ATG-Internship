/*
    건물 / 에너지원 선택하는 네비게이터
 */

"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BuildingId,
  EnergyTypeId,
  urlToBuildingKorean,
} from "@/data/buildings";

interface BuildingSubHeaderProps {
  currentBuildingId: number;
  currentEnergyTypeId?: number;
  label: string;
  icon: ReactNode;
}

export const BuildingEnergyNavigator: React.FC<BuildingSubHeaderProps> = ({
  currentBuildingId,
  currentEnergyTypeId,
  label,
  icon,
}) => {
  const buildingIds = [1, 2, 3, 4, 5];
  const energyTypes = [1, 2, 3];

  const router = useRouter();
  const pathname = usePathname();

  const [selectedBuildingId] = useState(currentBuildingId);
  const [selectedEnergyTypeId] = useState(currentEnergyTypeId);

  // URL의 마지막 값 혹은 두 값을 수정하여 라우팅
  const handleNavigate = (newBuildingId: number, newEnergyTypeId?: number) => {
    const pathSegments = pathname.split("/").filter(Boolean);

    // 마지막 두 값을 처리
    if (newEnergyTypeId) {
      pathSegments.splice(
        -2,
        2,
        newBuildingId.toString(),
        newEnergyTypeId.toString(),
      );
    } else {
      pathSegments.splice(-1, 1, newBuildingId.toString());
    }

    router.push(`/${pathSegments.join("/")}`);
  };

  return (
    <div className="flex flex-row items-center px-6 py-4 gap-4  bg-slate-200">
      {/* 제목 */}
      <div className="flex items-center gap-2 h-full text-lg font-bold leading-7 text-gray-700">
        {icon} {label}
      </div>

      {/* 건물 */}
      <div className="pr-3 pl-6 flex flex-row gap-4 items-center h-[36px] bg-white border-solid border-2 border-grey-200 rounded-full">
        <Select
          value={selectedBuildingId.toString()}
          onValueChange={(value) =>
            handleNavigate(Number(value), selectedEnergyTypeId)
          }
        >
          <div className="w-full text-sm font-bold leading-5 text-gray-700">
            건물명{" "}
          </div>
          <SelectTrigger className="p-0 h-[20px] gap-4 border-none drop-shadow-none shadow-none">
            <SelectValue placeholder="건물 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>건물</SelectLabel>
              {buildingIds.map((id) => (
                <SelectItem key={id} value={id.toString()}>
                  {urlToBuildingKorean[BuildingId[id]]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 에너지원 */}
      {selectedEnergyTypeId ? (
        <div className="pr-3 pl-6 flex flex-row gap-4 items-center h-[36px] bg-white border-solid border-2 border-grey-200 rounded-full">
          <Select
            value={selectedEnergyTypeId.toString()}
            onValueChange={(value) =>
              handleNavigate(selectedBuildingId, Number(value))
            }
          >
            <div className="w-full text-sm font-bold leading-5 text-gray-700">
              에너지원
            </div>
            <SelectTrigger className="p-0 h-[20px] gap-4 border-none drop-shadow-none shadow-none">
              <SelectValue placeholder="에너지원 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>에너지원</SelectLabel>
                {energyTypes.map((type) => (
                  <SelectItem key={type} value={type.toString()}>
                    {EnergyTypeId[type]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </div>
  );
};

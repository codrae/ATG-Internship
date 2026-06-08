"use client";

import { CustomButton } from "@/components/Buttons/BasicButton";
import { Building } from "lucide-react";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { BuildingId, buildingInfo, BuildingKey } from "@/data/buildings";
import Image from "next/image";

interface BuildingProp {
  building_id: number;
}
export function BuildingButton({ building_id }: BuildingProp) {
  const buildingKey = BuildingId[building_id] as BuildingKey;

  // buildingKey를 사용해 building 정보를 가져옴
  const building = buildingKey ? buildingInfo[buildingKey] : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <CustomButton
          text="건물정보"
          icon={<Building />}
          iconPosition={"left"}
        />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {building ? (
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{building.name}</h4>
              <p className="text-sm text-muted-foreground">
                {building.description}
              </p>
            </div>
            <div className="grid gap-2">
              <Image
                src={building.imageSrc}
                alt={building.name}
                width={300}
                height={200}
                className="rounded-lg mb-4"
              />
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="width">연면적</Label>
                <p className="text-sm text-muted-foreground">{building.area}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="maxWidth">건물 규모</Label>
                <p className="text-sm text-muted-foreground">
                  {building.floors}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="height">완공</Label>
                <p className="text-sm text-muted-foreground">
                  {building.yearBuilt}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            건물 정보를 찾을 수 없습니다.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

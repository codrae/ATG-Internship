/*
   "상태 정보" 아코디언 박스 버튼을 포함한 서브 헤더
 */

"use client";

import { BuildingId, urlToBuildingKorean } from "@/data/buildings";
import {
  ChevronsDown,
  Download,
  Droplet,
  ThermometerSun,
  Zap,
} from "lucide-react";
import { CustomButton } from "@/components/Buttons/BasicButton";
import { useState } from "react";
import InfoCard from "@/components/Cards/InfoCard";
import { BuildingButton } from "@/components/Buttons/BuildingButton";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface BuildingProp {
  building_id: number;
  total_energy: number;
}

export default function AccordianCard({
  building_id,
  total_energy,
}: BuildingProp) {
  const building_name = BuildingId[building_id];
  const [detailIsOpen, setDetailIsOpen] = useState(false);
  const toggleOpen = () => {
    setDetailIsOpen((prevState) => !prevState);
  };

  const handleDownloadPDF = async () => {
    // 현재 화면 캡처
    const body = document.body;

    // 화면 캡처
    const canvas = await html2canvas(body, {
      scale: 2, // 해상도 향상
    });

    const imgData = canvas.toDataURL("image/png");

    // PDF 생성
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190; // A4 가로 크기
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`${urlToBuildingKorean[building_name]}_화면.pdf`);
  };

  return (
    <div
      className={`flex flex-col w-full px-6 pt-8 gap-4 bg-white ${
        detailIsOpen ? "pb-4" : "pb-8"
      } `}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center">
          <p
            className="px-4 text-[40px] font-semibold text-gray-700"
            style={{ textAlign: "left" }}
          >
            {urlToBuildingKorean[building_name]}
          </p>
          <CustomButton
            text="상태정보"
            icon={<ChevronsDown />}
            iconPosition="right"
            onClick={toggleOpen}
            className={` ${
              detailIsOpen
                ? "bg-sky-100 text-blue-400 border border-sky-400"
                : "bg-white text-gray-700 border border-gray-700"
            }`}
          />
        </div>

        <div className="flex space-x-4">
          <BuildingButton building_id={building_id} />
          <CustomButton
            text="다운로드"
            icon={<Download />}
            iconPosition="left"
            onClick={handleDownloadPDF} // PDF 다운로드 함수 연결
            className="text-gray-100 bg-gray-700"
          />
        </div>
      </div>

      {detailIsOpen && (
        <div className="flex flex-row items-center justify-start p-4 gap-4 bg-slate-100 h-[112px]">
          <InfoCard
            icon={<ThermometerSun size={17} />}
            label={"온도"}
            value={"24.6"}
            description={"적정온도 15~26"}
          />
          <InfoCard
            icon={<Droplet size={17} />}
            label={"습도"}
            value={"62%"}
            description={"적정습도 40~70%"}
          />
          <InfoCard
            icon={<Zap size={17} />}
            label={"전력"}
            value={`${total_energy}kWh`}
            description={"평균전력보다 +5%"}
          />
        </div>
      )}
    </div>
  );
}

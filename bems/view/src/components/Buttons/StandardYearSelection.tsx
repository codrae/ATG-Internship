import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Props {
  building_id: number;
  userSelectedYear: number;
}

function StandardYearSelection({ userSelectedYear }: Props) {
  const thisYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(userSelectedYear);
  const years = [
    thisYear,
    thisYear - 1,
    thisYear - 2,
    thisYear - 3,
    thisYear - 4,
    thisYear - 5,
  ];

  // 기준이 되는 건물과 기간을 전달
  const handleNavigate = (building_id: number, year: number) => {
    // todo: 현재 선택된 년도와 다를 경우 쿼리 재요청
    setSelectedYear(year);
  };

  return (
    <div className="pr-3 pl-6 flex flex-row gap-4 items-center h-[36px] bg-white border-solid border-2 border-grey-200 rounded-full">
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => handleNavigate(1, Number(value))}
      >
        <div className="w-full text-sm font-bold leading-5 text-gray-700">
          기준년도
        </div>
        <SelectTrigger className="p-0 h-[20px] gap-4 border-none drop-shadow-none shadow-none">
          <SelectValue placeholder="건물 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>기준년도</SelectLabel>
            {years.map((id) => (
              <SelectItem key={id} value={id.toString()}>
                {id}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default StandardYearSelection;

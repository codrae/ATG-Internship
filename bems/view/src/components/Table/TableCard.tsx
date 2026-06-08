import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AlarmTable from "@/components/Table/Table";
import React from "react";

interface TableProps {
  building_id: number;
}
function TableCard({ building_id }: TableProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex-row justify-between items-center px-6 pb-2 w-full">
        <CardTitle className="text-left text-lg font-bold leading-7">
          기간별 총 원단위
        </CardTitle>
        <CardDescription className="text-right text-sm font-normal leading-5">
          선택한 기간(월단위)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlarmTable building_id={building_id} />
      </CardContent>
    </Card>
  );
}

export default TableCard;

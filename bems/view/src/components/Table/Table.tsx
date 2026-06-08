"use client";
// todo: useColumnHelper 사용하기
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/table-core";

import { flexRender, useReactTable } from "@tanstack/react-table";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DateHelper } from "@/utils/DateHelper";

interface Props {
  building_id: number;
  label?: string; // 제목
}
export interface FilterdBuildingAnomalyItem {
  id: number;
  createdAt: [number, number, number, number, number];
  value: number;
  energyType: string;
  predict?: number; // todo: 별개로 불러와야함
}

// 컬럼 keys
export const columns: ColumnDef<FilterdBuildingAnomalyItem>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          발행일자
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = DateHelper.arrayToDate(row.original.createdAt);
      return <>{date.toLocaleString()}</>;
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const threshold = 10.0;
      let diff = 0.0;
      if (row.original.predict) {
        diff = Math.abs(row.original.value - row.original.predict);
      }
      const status = diff > threshold ? "alert" : "good";
      const statusClass =
        status === "alert"
          ? "bg-red-500 text-white"
          : "bg-green-500 text-white";
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${statusClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          실제값
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "predict",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          예측값
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "diff",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          오차
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const diff = row.original.predict
        ? Math.abs(row.original.value - row.original.predict)
        : 0.0;

      return <>{diff}</>;
    },
  },
  {
    accessorKey: "comment",
    header: "코멘트",
    cell: ({ row }) => {
      const threshold = 10.0;
      const diff = row.original.predict
        ? Math.abs(row.original.value - row.original.predict)
        : 0.0;
      return <>{diff > threshold ? "이상치 발생" : "정상 데이터"}</>;
    },
  },
];

export default function AlarmTable({ building_id }: Props) {
  const API_URL = `/api/anomaly/${building_id}?count=3`;
  const {
    data = [],
    error,
    isLoading,
  } = useQuery<FilterdBuildingAnomalyItem[]>({
    queryKey: ["anomalyEnergyData", building_id],
    queryFn: async (): Promise<FilterdBuildingAnomalyItem[]> => {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }
      return res.json();
    },
  });

  // todo: 예측값 호출 api 추가

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-gray-600 text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500 text-lg font-semibold">
          <h1>Error</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <Table className="border-[1px] border-[#E2E8F0] rounded-t-lg rounded-b-lg">
        <TableHeader>
          <TableRow>
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              )),
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

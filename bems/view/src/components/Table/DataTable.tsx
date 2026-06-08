import React from "react";

interface DataTableProps {
  data: Record<string, string | number>[]; // 더 구체적인 타입 지정
  columns: { key: string; label: string }[]; // 컬럼 정보
}

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        {/* 테이블 헤더 */}
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        {/* 테이블 바디 */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border border-gray-300 px-4 py-2 text-sm"
                  >
                    {row[column.key] !== undefined ? row[column.key] : "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

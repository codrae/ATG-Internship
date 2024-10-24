import React from 'react';
import { Point } from '@/types';

interface MarkerDataTableProps {
    tableData: Point[];
    mode: string | null;
    downloadCSV: () => void;
}

const MarkerDataTable: React.FC<MarkerDataTableProps> = ({ tableData, mode, downloadCSV }) => {
    if (tableData.length === 0 || mode === 'distance') return null;

    return (
        <div className="mb-4 mt-4">
            <h2 className="text-xl font-bold mb-2">Marker Data Table</h2>
            <table className="table-auto w-full text-left">
                <thead>
                <tr>
                    <th className="border px-4 py-2">X</th>
                    <th className="border px-4 py-2">Y</th>
                </tr>
                </thead>
                <tbody>
                {tableData
                    .sort((a, b) => a.x - b.x)
                    .map((row, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{row.x}</td>
                            <td className="border px-4 py-2">{row.y}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={downloadCSV}
                className="bg-orange-500 text-white px-4 py-2 rounded mt-4"
            >
                CSV 다운로드
            </button>
        </div>
    );
};

export default MarkerDataTable;

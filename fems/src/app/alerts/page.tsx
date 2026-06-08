"use client";
// 전체 알림 로그 확인 페이지

import React, { useState } from "react";

const sampleLogs = [
  {
    date: "2022-07-12 13:00:55",
    fault: "Failure_step2",
    equipment: "Reducer #14",
    measurement: "G3V",
    module: "re_bearing",
  },
  {
    date: "2022-07-12 13:00:55",
    fault: "Unbalance",
    equipment: "Reducer #14",
    measurement: "G3V",
    module: "rotor",
  },
  {
    date: "2022-07-12 13:00:55",
    fault: "Normal",
    equipment: "Reducer #18",
    measurement: "G3V",
    module: "fan",
  },
  {
    date: "2022-07-12 11:00:55",
    fault: "Failure_step2",
    equipment: "Reducer #14",
    measurement: "G3V",
    module: "re_bearing",
  },
  {
    date: "2022-07-12 11:00:55",
    fault: "Unbalance",
    equipment: "Reducer #18",
    measurement: "G3V",
    module: "rotor",
  },
];

const AlertLogsPage: React.FC = () => {
  const [filter, setFilter] = useState({
    facility: "All",
    equipment: "All",
    startDate: "",
    endDate: "",
    alarmType: ["Trip", "Alert", "Normal"],
  });
  const [logs, setLogs] = useState(sampleLogs);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // 서버에서 필터를 기반으로 데이터 가져오기 (여기선 샘플 데이터를 사용)
    console.log("Filtering logs with:", filter);
    setLogs(sampleLogs); // 실제 데이터로 교체
  };

  const handleDownloadCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Date,Fault,Equipment,Measurement,Module\n${logs
      .map(
        (log) =>
          `${log.date},${log.fault},${log.equipment},${log.measurement},${log.module}`,
      )
      .join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alerts_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* 왼쪽 필터 */}
      <div className="w-1/4 p-6 bg-gray-800 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Search Filter</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Facility</label>
            <select
              value={filter.facility}
              onChange={(e) => handleFilterChange("facility", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
            >
              <option value="All">All</option>
              <option value="Factory 1">Factory 1</option>
              <option value="Factory 2">Factory 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Equipment</label>
            <select
              value={filter.equipment}
              onChange={(e) => handleFilterChange("equipment", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
            >
              <option value="All">All</option>
              <option value="Reducer #14">Reducer #14</option>
              <option value="Reducer #18">Reducer #18</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Alarm Type</label>
            <div className="space-y-2">
              {["Trip", "Alert", "Normal"].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filter.alarmType.includes(type)}
                    onChange={() => {
                      const updated = filter.alarmType.includes(type)
                        ? filter.alarmType.filter((t) => t !== type)
                        : [...filter.alarmType, type];
                      handleFilterChange("alarmType", updated);
                    }}
                    className="form-checkbox text-blue-500"
                  />
                  <span className="ml-2">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 space-x-4">
          <button
            onClick={handleSearch}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Search
          </button>
          <button
            onClick={() =>
              setFilter({
                facility: "All",
                equipment: "All",
                startDate: "",
                endDate: "",
                alarmType: ["Trip", "Alert", "Normal"],
              })
            }
            className="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded-md mt-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 오른쪽 로그 테이블 */}
      <div className="w-3/4 p-6">
        <h2 className="text-xl font-semibold mb-4">Alarm History</h2>
        <div className="overflow-x-auto bg-gray-800 p-4 rounded-md shadow-md">
          <table className="min-w-full text-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Fault</th>
                <th className="py-2 px-4">Equipment</th>
                <th className="py-2 px-4">Measurement</th>
                <th className="py-2 px-4">Module</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="py-2 px-4">{log.date}</td>
                  <td className="py-2 px-4">{log.fault}</td>
                  <td className="py-2 px-4">{log.equipment}</td>
                  <td className="py-2 px-4">{log.measurement}</td>
                  <td className="py-2 px-4">{log.module}</td>
                  <td className="py-2 px-4">
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md">
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default AlertLogsPage;

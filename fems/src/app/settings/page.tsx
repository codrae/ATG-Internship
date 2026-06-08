"use client";

import React, { useState } from "react";

const SettingsPage = () => {
  const [processName, setProcessName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProcessName(e.target.value);
  };

  const handleQuery = () => {
    console.log(`Querying settings for: ${processName}`);
    // 여기에 API 호출 로직을 추가하세요.
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">메뉴</h2>
        <ul className="space-y-4">
          <li className="text-blue-500 font-medium cursor-pointer">
            공정 설정
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            공정 정보와 데이터 보관 기간 설정
          </li>
          <li className="cursor-pointer hover:text-blue-500">보고서 관리</li>
          <li className="cursor-pointer hover:text-blue-500">회원 관리</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        <h1 className="text-2xl font-bold mb-6">공정 설정</h1>
        <div className="flex items-center space-x-4 mb-6">
          <label className="font-medium" htmlFor="process-input">
            공정
          </label>
          <input
            id="process-input"
            type="text"
            value={processName}
            onChange={handleInputChange}
            placeholder="텍스트 입력"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            onClick={handleQuery}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            조회
          </button>
        </div>
        <div className="border rounded-md p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">공정</th>
                <th className="text-left p-2">메인</th>
                <th className="text-left p-2">프리</th>
                <th className="text-left p-2">수정</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">공정 1</td>
                <td className="p-2">메인 1</td>
                <td className="p-2">프리 1</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">
                    수정
                  </button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">공정 2</td>
                <td className="p-2">메인 2</td>
                <td className="p-2">프리 2</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">
                    수정
                  </button>
                </td>
              </tr>
              {/* 추가 데이터는 여기서 반복 */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

// notification/page.tsx
"use client";

import React from "react";
import { useNotification } from "@/hooks/useNotification";

const NotificationPage = () => {
  const { notifications, clearNotifications } = useNotification();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">전체 알림 로그</h1>
      <div className="bg-white shadow rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">알림 로그</h2>
          <button
            className="text-blue-500 text-sm"
            onClick={clearNotifications}
          >
            모든 알림 지우기
          </button>
        </div>
        <table className="w-full border-collapse table-auto text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2">시간</th>
              <th className="px-4 py-2">알림 메시지</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((notification, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2 text-gray-500">
                    {notification.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {notification.message}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-2 text-gray-500 text-center">
                  알림이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; // TODO: 추후 DB를 연결해 상위 알림을 가져오는 방식으로 변경해주어야함. isAnomalry로 판단 후 해당 컴포넌트를 리렌더링해야 함.

export default NotificationPage;

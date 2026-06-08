// hooks/useNotification.ts
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string) => {
      // 중복 방지: 같은 메시지가 마지막 알림과 같으면 추가하지 않음
      if (notifications.length > 0 && notifications[0].message === message) {
        return;
      }

      const newNotification: Notification = {
        id: uuidv4(),
        message,
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // 자동으로 알림을 5초 후에 제거
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotification.id),
        );
      }, 5000); // 5초 후 자동 삭제
    },
    [notifications],
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { notifications, addNotification, clearNotifications };
};

"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SettingsButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/settings"); // '/settings' 페이지로 이동
  };

  return (
    <button
      className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
      onClick={handleClick}
    >
      설정
    </button>
  );
};

export default SettingsButton;

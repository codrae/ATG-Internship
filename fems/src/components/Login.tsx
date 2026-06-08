// src/components/Login.tsx
import React from "react";
import Image from "next/image";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 relative w-full h-full">
      {/* 중앙 로고 */}
      <div className="mb-8">
        <Image
          src="/simmtech_logo.jpg"
          alt="Simmtech Logo"
          width={1600}
          height={1600}
          unoptimized={true}
        />
      </div>

      {/* 아이디/비밀번호 입력 폼 */}
      <div className="w-128 space-y-4">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700 w-1/3">
            ID :
          </label>
          <input
            type="text"
            placeholder="아이디 입력"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700 w-1/3">
            PW :
          </label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
        </div>
      </div>

      {/* 우측 하단 로고 */}
      <div className="absolute bottom-4 right-4">
        <Image
          src="/atg_logo.png"
          alt="ATG Logo"
          width={100}
          height={40}
          className="opacity-60"
          unoptimized={true}
        />
      </div>
    </div>
  );
};

export default Login;

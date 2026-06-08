"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/factory"); // "/reports" 경로로 이동
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 relative w-full h-full">
      {/* 중앙 로고 */}
      <div className="mb-8">
        <Image
          src="/logo-removebg-preview.png"
          alt="Simmtech Logo"
          width={400}
          height={200}
          unoptimized={true}
        />
      </div>

      {/* 아이디/비밀번호 입력 폼 및 로그인 버튼 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="w-64 space-y-4"
      >
        <div className="flex items-center">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 w-1/3"
          >
            ID :
          </label>
          <input
            id="username"
            type="text"
            placeholder="아이디 입력"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 w-1/3"
          >
            PW :
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호 입력"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
        >
          로그인
        </button>
      </form>

      {/* 우측 하단 로고 */}
      <div className="absolute bottom-4 right-4">
        <Image
          src="/atg_logo-removebg-preview.png"
          alt="ATG Logo"
          width={80}
          height={32}
          className="opacity-60"
          unoptimized={true}
        />
      </div>
    </div>
  );
};

export default Login;

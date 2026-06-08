"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기/가리기 상태

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username && password) {
      console.log("로그인 성공:", { username, password });
      router.push("/dashboard");
    } else {
      alert("아이디와 비밀번호를 입력해주세요.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // 상태를 토글
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* 왼쪽 영역 */}
      <div className="w-1/2 relative">
        <Image
          src="/images/right.svg"
          alt="인하대학교 로고"
          fill
          style={{
            objectFit: "cover",
          }}
          priority
        />
      </div>

      {/* 오른쪽 영역 */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            INHA BEMS
          </h2>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            {/* 아이디 입력 */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                아이디
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                비밀번호
              </label>
              <input
                type={showPassword ? "text" : "password"} // 보이기/가리기 상태
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {/* 눈 아이콘 */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-9 right-4 transform item-center"
              >
                {showPassword ? (
                  <Image
                    src="/images/eye-open.webp" // 보이기 상태 아이콘
                    alt="Hide Password"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src="/images/EyeSlash.svg" // 가리기 상태 아이콘
                    alt="Show Password"
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="auto-login"
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="auto-login"
                className="ml-2 text-gray-700 text-sm"
              >
                자동 로그인
              </label>
            </div>
            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full bg-[#38BDF8] text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition duration-300"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";

import React, { useState } from "react";

// -----------------------------------------------------------------------------
// 탭 구분용 타입
// -----------------------------------------------------------------------------
type SettingsTab = "공기조화" | "알림관리" | "회원관리";

// -----------------------------------------------------------------------------
// 상수/더미 데이터
// -----------------------------------------------------------------------------
const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

// 알림관리, 회원관리 테이블용 더미 데이터
interface AlertData {
  id: number;
  date: string;
  status: "이상치 발생" | "정상";
  actual: number;
  predicted: number;
  error: number;
  comment: string;
}

interface MemberData {
  id: number;
  level: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  joinedAt: string;
  lastLogin: string;
}

const dummyAlertData: AlertData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  date: "2024.11.04 오전 11:00:10",
  status: "이상치 발생",
  actual: 75.0,
  predicted: 75.0,
  error: 0.0,
  comment: "모델 이상 → 재학습 처리",
}));

const dummyMemberData: MemberData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  level: (i % 3) + 1, // 1~3 레벨
  userId: "dangani32",
  name: "강다니",
  email: "dani@gmail.com",
  phone: "032-123-4567",
  mobile: "010-1234-5678",
  joinedAt: "2024.10.29",
  lastLogin: "2024.11.04",
}));

// -----------------------------------------------------------------------------
// 공용 페이징 컴포넌트
// -----------------------------------------------------------------------------
interface PaginationProps {
  totalCount: number;
  pageSize?: number;
  currentPage?: number;
  onChangePage?: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  pageSize = 10,
  currentPage = 1,
  onChangePage,
}) => {
  const pageCount = Math.ceil(totalCount / pageSize);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).slice(0, 10); // 최대 10페이지 표시 예시

  return (
    <div className="flex justify-between items-center mt-4">
      <div>전체 {totalCount}건</div>
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
          onClick={() => onChangePage && onChangePage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          &lt;
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => onChangePage && onChangePage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
          onClick={() => onChangePage && onChangePage(currentPage + 1)}
          disabled={currentPage >= pageCount}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 공기조화 탭 컴포넌트
// -----------------------------------------------------------------------------
const AirControlTab: React.FC = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-6">최소 환기운전</h2>
      <form>
        {/* 제어 기간 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <label className="block font-semibold mb-2">제어 기간</label>
            <div className="flex space-x-4">
              <input
                type="date"
                className="w-full border-gray-300 rounded-md p-2"
              />
              <input
                type="date"
                className="w-full border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          <div className="col-span-1 flex space-x-2 items-end">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              1일
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              1개월
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              3개월
            </button>
          </div>
        </div>

        {/* 베이스라인 설정 */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="font-bold mb-4">베이스라인 설정</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">기간 선택</label>
              <div className="flex space-x-4">
                <input
                  type="date"
                  className="w-full border-gray-300 rounded-md p-2"
                />
                <input
                  type="date"
                  className="w-full border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">대상 선택</label>
              <div className="flex space-x-4">
                <select className="w-full border-gray-300 rounded-md p-2">
                  <option>선택</option>
                </select>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  수동
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
                  자동
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 운전 설정 */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="font-bold mb-4">운전 설정</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">실행 시간</label>
              <div className="flex space-x-4">
                <select className="w-full border-gray-300 rounded-md p-2">
                  <option>06:00</option>
                </select>
                <select className="w-full border-gray-300 rounded-md p-2">
                  <option>18:00</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">조건 판단 주기</label>
              <select className="w-full border-gray-300 rounded-md p-2">
                <option>5분</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">실내 쾌적 온도</label>
              <select className="w-full border-gray-300 rounded-md p-2">
                <option>25℃</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-semibold mb-2">반복 주기</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                >
                  {day}
                </button>
              ))}
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
                매일
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
                주말 제외
              </button>
            </div>
          </div>
        </div>

        {/* 제어 조건 */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="font-bold mb-4">제어 조건</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">CO2 농도</label>
              <select className="w-full border-gray-300 rounded-md p-2">
                <option>1,000 ppm</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">퇴실자</label>
              <select className="w-full border-gray-300 rounded-md p-2">
                <option>20%</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">
                실내외 온도 편차
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full border-gray-300 rounded-md p-2"
                  defaultValue={2}
                />
                <span className="ml-2">℃ 이상</span>
              </div>
            </div>
          </div>
        </div>

        {/* 제어 내용 */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="font-bold mb-4">제어 내용</h3>
          <div className="grid grid-cols-5 gap-4">
            {["외기댐퍼", "배기댐퍼", "순환댐퍼", "급기팬", "배기팬"].map(
              (item) => (
                <div key={item}>
                  <label className="block font-semibold mb-2">{item}</label>
                  <input
                    type="number"
                    className="w-full border-gray-300 rounded-md p-2"
                    defaultValue={0}
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            확인
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            취소
          </button>
        </div>
      </form>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 알림관리 탭 컴포넌트
// -----------------------------------------------------------------------------
const AlertManagementTab: React.FC = () => {
  // state, event handler 예시(실제로는 서버통신 등과 연동)
  const [alertData] = useState<AlertData[]>(dummyAlertData);

  const handleChangePage = (page: number) => {
    // TODO: 실제 페이지 변경 로직
    console.log("페이지 변경:", page);
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-6">알림 정보 목록</h2>
      {/* 검색 옵션 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block font-semibold mb-2">기간 선택</label>
            <div className="flex space-x-2">
              <input type="date" className="border-gray-300 rounded-md p-2" />
              <input type="date" className="border-gray-300 rounded-md p-2" />
            </div>
          </div>
          <div className="flex space-x-2 mt-6">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              1일
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              1개월
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              3개월
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              6개월
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              1년
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">상태:</span>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md">
              이상치 발생
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
              정상
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              className="border-gray-300 rounded-md p-2 w-60"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              검색
            </button>
          </div>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            다운로드
          </button>
        </div>
      </div>

      {/* 데이터 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-2 border border-gray-300">번호</th>
              <th className="px-4 py-2 border border-gray-300">발생일자</th>
              <th className="px-4 py-2 border border-gray-300">상태</th>
              <th className="px-4 py-2 border border-gray-300">실제값</th>
              <th className="px-4 py-2 border border-gray-300">예측값</th>
              <th className="px-4 py-2 border border-gray-300">오차</th>
              <th className="px-4 py-2 border border-gray-300">코멘트</th>
            </tr>
          </thead>
          <tbody>
            {alertData.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.id}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.date}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <span className="px-3 py-1 bg-red-500 text-white rounded-md">
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.actual}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.predicted}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.error}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
      <Pagination
        totalCount={1203}
        pageSize={10}
        currentPage={1}
        onChangePage={handleChangePage}
      />
    </section>
  );
};

// -----------------------------------------------------------------------------
// 회원관리 탭 컴포넌트
// -----------------------------------------------------------------------------
const MemberManagementTab: React.FC = () => {
  const [memberData] = useState<MemberData[]>(dummyMemberData);

  const handleChangePage = (page: number) => {
    // TODO: 실제 페이지 변경 로직
    console.log("페이지 변경:", page);
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-6">회원 정보 목록</h2>
      {/* 검색 옵션 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">직책 선택:</span>
            {["Level 1", "Level 2", "Level 3"].map((level, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md ${
                  index === 0
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div>
            <label className="block font-semibold mb-2">조건 검색</label>
            <select className="w-40 border-gray-300 rounded-md p-2">
              <option>조건 선택</option>
              <option>아이디</option>
              <option>이름</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            className="border-gray-300 rounded-md p-2 w-60"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            검색
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            + 회원추가
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            다운로드
          </button>
        </div>
      </div>

      {/* 데이터 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-2 border border-gray-300">번호</th>
              <th className="px-4 py-2 border border-gray-300">직책</th>
              <th className="px-4 py-2 border border-gray-300">아이디</th>
              <th className="px-4 py-2 border border-gray-300">이름</th>
              <th className="px-4 py-2 border border-gray-300">이메일</th>
              <th className="px-4 py-2 border border-gray-300">전화번호</th>
              <th className="px-4 py-2 border border-gray-300">핸드폰</th>
              <th className="px-4 py-2 border border-gray-300">가입일</th>
              <th className="px-4 py-2 border border-gray-300">최근접속일</th>
              <th className="px-4 py-2 border border-gray-300">편집</th>
            </tr>
          </thead>
          <tbody>
            {memberData.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.id}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-md">
                    Level {row.level}
                  </span>
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.userId}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.name}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.email}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.phone}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.mobile}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.joinedAt}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  {row.lastLogin}
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md">
                    편집
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
      <Pagination
        totalCount={1203}
        pageSize={10}
        currentPage={1}
        onChangePage={handleChangePage}
      />
    </section>
  );
};

// -----------------------------------------------------------------------------
// 메인 SettingsPage
// -----------------------------------------------------------------------------
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("공기조화");

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <header className="bg-gray-100 p-4 rounded-md mb-6">
        <h1 className="text-2xl font-bold text-center">설정</h1>
        <nav className="mt-4">
          <ul className="flex justify-center space-x-4">
            {(["공기조화", "알림관리", "회원관리"] as SettingsTab[]).map(
              (tab) => (
                <li
                  key={tab}
                  className={`cursor-pointer px-4 py-2 rounded-md ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ),
            )}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-white p-4 shadow rounded-md">
        {activeTab === "공기조화" && <AirControlTab />}
        {activeTab === "알림관리" && <AlertManagementTab />}
        {activeTab === "회원관리" && <MemberManagementTab />}
      </main>
    </div>
  );
};

export default SettingsPage;

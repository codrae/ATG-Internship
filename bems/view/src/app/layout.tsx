"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/layout/Header";
import Providers from "@/app/provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import CustomSidebar from "@/components/layout/customSidebar";
import { CustomTrigger } from "@/components/layout/SiderBarTrigger";

// 로컬 폰트 정의
// const geistSans = localFont({
//   src: "/fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
//
// const geistMono = localFont({
//   src: "/fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// 서버 컴포넌트에서 metadata API를 사용
// export const metadata: Metadata = {
//   title: "BEMS 에너지 관리 시스템",
//   description: "설비별 에너지 관리 및 모니터링",
//   keywords: "BEMS, 에너지 관리, 모니터링, 설비 관리",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // 현재 경로 가져오기

  // 특정 페이지 (예: /login)에서는 레이아웃 제외
  const excludedPaths = ["/login"];

  if (excludedPaths.includes(pathname)) {
    return <>{children}</>; // 레이아웃 없이 children만 반환
  }

  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          <div className="flex flex-col h-screen w-full">
            {/* Header */}
            {/*todo*/}
            {/* Main content */}
            <SidebarProvider>
              <div className="flex flex-1">
                <CustomSidebar />
                <main className="flex-1 bg-gray-100">
                  <CustomTrigger />
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}

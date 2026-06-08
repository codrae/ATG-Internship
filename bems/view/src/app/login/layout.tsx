// app/login/layout.tsx
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 여기에 로그인 페이지용 레이아웃이나 스타일 적용 */}
      <html>
        <body>{children}</body>
      </html>
    </>
  );
}

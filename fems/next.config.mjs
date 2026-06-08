/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 정적 사이트 생성 활성화
  images: {
    loader: "akamai", // Netlify의 이미지 최적화와 충돌을 피하기 위한 설정
    path: "",
  },
  // experimental: {
  //     appDir: true // 앱 라우터 사용 활성화
  // }
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination:`http://${process.env.BASE_URL}/api/:path*`,
  //     },
  //   ];
  // },
  // 필요한 경우 다른 설정 추가
};

export default nextConfig;

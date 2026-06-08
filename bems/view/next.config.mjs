/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/", // 기본 경로
        destination: "/login", // 리다이렉트할 경로
        permanent: true, // 영구 리다이렉트 설정 (301)
      },
    ];
  },
};

export default nextConfig;

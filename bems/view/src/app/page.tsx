import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // 서버 사이드에서 리다이렉트 처리
  return null;
}

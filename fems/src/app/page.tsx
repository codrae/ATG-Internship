// import React from "react";
// import "./globals.css";
//
// const App = () => {
//   return <h1>SIMMTECH PROJECT!</h1>;
// };
//
// export default App;

import { redirect } from "next/navigation";

export default function HomePage() {
  // 서버 사이드 리다이렉션 처리
  redirect("/signin");
}

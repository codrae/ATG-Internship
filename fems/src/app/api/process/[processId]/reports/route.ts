/*
  공정 리포트 페이지 src/app/reports/[process_id]/page.tsx
  useAtom으로 resourseId==processId 인 배열 가져온 뒤 sensorId 배열의 measurement_point 조회

 */

import { NextApiResponse } from "next";

export async function GET(res: NextApiResponse) {
  try {
    const response = await fetch("/api/measurement_point/{sensorId}");
    const data = response.json();
    res.status(200).json(data);
    return Response.json({ data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

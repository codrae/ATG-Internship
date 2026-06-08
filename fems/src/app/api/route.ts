/*
  모든 공정 데이터 list 호출
 */

import { NextApiResponse } from "next";

export async function GET(res: NextApiResponse) {
  try {
    const response = await fetch("/api/machines?eid=15053");
    if (!response.ok)
      throw new Error(`Failed to fetch machines data: ${response.statusText}`);

    const data = await response.json();
    res.status(200).json(data);
    return Response.json({ data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

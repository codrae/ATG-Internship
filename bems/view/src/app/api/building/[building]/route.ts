// app/api/cost/[building]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { building: string } },
) {
  try {
    const res = await fetch(
      `${process.env.SPRING_URL}/building/${params.building}`,
    );
    console.log(`url : ${process.env.SPRING_URL}/building/${params.building}`);

    if (!res.ok) {
      return NextResponse.json(
        { message: `Failed to fetch data: ${res.statusText}` },
        { status: res.status },
      );
    }
    return NextResponse.json(res);
  } catch (error) {
    console.error("Failed to fetch data from server:", error);
    return NextResponse.json(
      { message: "Data fetching failed", error },
      { status: 500 },
    );
  }
}

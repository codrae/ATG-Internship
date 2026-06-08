import { NextRequest, NextResponse } from "next/server";

const BuildingDBForm: Record<number, string> = {
  1: "BUILDING_1",
  2: "ANNIVERSARY_MEMORIAL_HALL",
  3: "LAW_SCHOOL_BUILDING",
  4: "INHA_DREAM_CENTER_2_3",
  5: "HIGH_TECH_CENTER",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { building: number } },
) {
  const buildingId = params.building;
  const buildingDBForm = BuildingDBForm[buildingId];

  try {
    const res = await fetch(
      `${process.env.SPRING_URL}/charge/${buildingDBForm}/today`,
    );

    const todayTotalCost: number = await res.json();
    console.log("Fetched month today usage:", todayTotalCost);

    return NextResponse.json(todayTotalCost);
  } catch (error) {
    console.error("Failed to fetch data from server:", error);
    return NextResponse.json(
      { message: "Data fetching failed", error },
      { status: 500 },
    );
  }
}

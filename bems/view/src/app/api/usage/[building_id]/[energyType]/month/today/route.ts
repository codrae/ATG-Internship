import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: { building_id: string; energyType: string };
  },
) {
  const { building_id, energyType } = params;

  console.log(
    "Received building and energy type:",
    {
      building_id,
      energyType,
    },
    typeof building_id,
  );

  try {
    console.log(
      `Requesting data from URL: ${process.env.SPRING_URL}/api/${building_id}/${energyType}/month/today`,
    );
    const res = await fetch(
      `${process.env.SPRING_URL}/api/${building_id}/${energyType}/month/today`,
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          message: `Failed to fetch data: ${res.statusText}`,
        },
        { status: res.status },
      );
    }

    const monthTodayUsage: number = await res.json();
    console.log("Fetched month today usage:", monthTodayUsage);

    return NextResponse.json(monthTodayUsage);
  } catch (error) {
    console.error(`Error fetching data for energy type ${energyType}:`, error);
    return NextResponse.json(
      { message: "Unexpected error occurred", error: String(error) },
      { status: 500 },
    );
  }
}

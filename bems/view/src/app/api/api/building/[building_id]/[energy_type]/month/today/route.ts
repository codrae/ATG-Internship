import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { building_id: string; energy_type: string } },
) {
  try {
    const res = await fetch(
      `${process.env.SPRING_URL}/api/${params.building_id}/${params.energy_type}/month/today`,
    );

    console.log(
      `Requesting data from URL: ${process.env.SPRING_URL}/api/${params.building_id}/${params.energy_type}month/today`,
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          message: `Failed to fetch data: ${res.statusText}`,
        },
        { status: res.status },
      );
    }

    const buildingMonthTodayUsage: number = await res.json();
    console.log(
      `Fetched ${params.building_id} month today usage:`,
      buildingMonthTodayUsage,
    );

    return NextResponse.json(buildingMonthTodayUsage);
  } catch (error) {
    console.error(
      `Error fetching data for building type ${params.building_id}:`,
      error,
    );
    return NextResponse.json(
      { message: "Unexpected error occurred", error: String(error) },
      { status: 500 },
    );
  }
}

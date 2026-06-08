import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { energy_type: string } },
) {
  const energyType = params.energy_type;
  console.log("Received energy type:", energyType);

  try {
    const res = await fetch(
      `${process.env.SPRING_URL}/api/${energyType}/month/today`,
    );

    console.log(
      `Requesting data from URL: ${process.env.SPRING_URL}/api/${energyType}/month/today`,
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

import { NextRequest, NextResponse } from "next/server";
import { getMealPlanEntries } from "@/server/mealPlan";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    const entries = await getMealPlanEntries(startDate, endDate);
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching meal plan entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plan entries" },
      { status: 500 }
    );
  }
}

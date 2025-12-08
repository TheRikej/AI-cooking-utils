import { NextResponse } from "next/server";
import { readRecipes } from "@/server/recipes";

export async function GET() {
  try {
    const recipes = await readRecipes("all");
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

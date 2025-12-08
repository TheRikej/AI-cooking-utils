import { NextRequest, NextResponse } from "next/server";
import { createRecipe } from "@/server/recipes";
import { createMealPlanEntry } from "@/server/mealPlan";
import { auth } from "@/auth";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { startDate, endDate, preferences } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff < 0 || daysDiff > 14) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 }
      );
    }

    const dates: string[] = [];
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    const totalMeals = dates.length * MEAL_TYPES.length;

    const prompt = `Generate a ${daysDiff + 1}-day meal plan with ${totalMeals} recipes (${MEAL_TYPES.join(", ")} for each day).
${preferences ? `Dietary preferences: ${preferences}` : ""}

Return ONLY a JSON array with exactly ${totalMeals} recipes in this format:
[
  {
    "Title": "Recipe Title",
    "Description": "Brief description",
    "Ingredients": "- ingredient 1\\n- ingredient 2\\n- ingredient 3",
    "Instructions": "1. Step one\\n2. Step two\\n3. Step three",
    "MealType": "Breakfast|Lunch|Dinner"
  }
]

Important:
- Return ONLY the JSON array, no additional text
- Make recipes varied and interesting
- Ensure balanced nutrition across meals
- Generate ${MEAL_TYPES.length} recipes per day (one for each meal type)`;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "deepseek-ai/DeepSeek-V3.2:novita",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("AI API error:", response.status, errorData);

      return NextResponse.json(
        { error: "Failed to generate meal plan" },
        { status: 500 }
      );
    }

    const data = await response.json();
    let jsonContent = data?.choices?.[0]?.message?.content;

    if (!jsonContent) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }

    const firstBracket = jsonContent.indexOf("[");
    const lastBracket = jsonContent.lastIndexOf("]");

    if (firstBracket !== -1 && lastBracket !== -1) {
      jsonContent = jsonContent.slice(firstBracket, lastBracket + 1);
    }

    let recipes;
    try {
      recipes = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    if (!Array.isArray(recipes)) {
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 }
      );
    }

    let mealIndex = 0;
    for (const date of dates) {
      for (const mealType of MEAL_TYPES) {
        if (mealIndex >= recipes.length) break;

        const recipeData = recipes[mealIndex];

        try {
          const createdRecipe = await createRecipe({
            title: recipeData.Title || `${mealType} Recipe`,
            description: recipeData.Description || null,
            ingredients: recipeData.Ingredients || "No ingredients listed",
            instructions: recipeData.Instructions || "No instructions provided",
            isPublic: false,
            createdById: userId,
            imageUrl: null,
          });

          await createMealPlanEntry({
            date,
            mealType,
            recipeId: createdRecipe.id,
          });
        } catch (error) {
          console.error("Error creating recipe or meal plan entry:", error);
        }

        mealIndex++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated meal plan for ${dates.length} days`,
    });
  } catch (error) {
    console.error("Error in meal plan generation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

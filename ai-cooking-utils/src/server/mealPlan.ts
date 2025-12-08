import { db } from "@/db";
import { mealPlanEntries } from "@/db/schema/mealPlan";
import { recipes } from "@/db/schema/recipes";
import type { MealPlanEntry, NewMealPlanEntry } from "@/db/schema/mealPlan";
import { eq, and, gte, lte } from "drizzle-orm";
import { auth } from "@/auth";

export type MealPlanEntryWithRecipe = MealPlanEntry & {
  recipe: {
    id: number;
    title: string;
    description: string | null;
  } | null;
};

export async function getMealPlanEntries(
  startDate: string,
  endDate: string
): Promise<MealPlanEntryWithRecipe[]> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const entries = await db
    .select({
      entry: mealPlanEntries,
      recipe: {
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
      },
    })
    .from(mealPlanEntries)
    .leftJoin(recipes, eq(mealPlanEntries.recipeId, recipes.id))
    .where(
      and(
        eq(mealPlanEntries.userId, userId),
        gte(mealPlanEntries.date, startDate),
        lte(mealPlanEntries.date, endDate)
      )
    )
    .orderBy(mealPlanEntries.date);

  return entries.map((row) => ({
    ...row.entry,
    recipe: row.recipe?.id ? row.recipe : null,
  }));
}

export async function createMealPlanEntry(
  input: Omit<NewMealPlanEntry, "userId">
): Promise<MealPlanEntry> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [created] = await db
    .insert(mealPlanEntries)
    .values({
      ...input,
      userId,
    })
    .returning();

  return created;
}

export async function updateMealPlanEntry(
  id: number,
  recipeId: number | null
): Promise<MealPlanEntry | undefined> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [updated] = await db
    .update(mealPlanEntries)
    .set({ recipeId })
    .where(and(eq(mealPlanEntries.id, id), eq(mealPlanEntries.userId, userId)))
    .returning();

  return updated;
}

export async function deleteMealPlanEntry(id: number): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  await db
    .delete(mealPlanEntries)
    .where(and(eq(mealPlanEntries.id, id), eq(mealPlanEntries.userId, userId)));
}

export async function getMealPlanEntryForDateAndMealType(
  date: string,
  mealType: string
): Promise<MealPlanEntryWithRecipe | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const entries = await db
    .select({
      entry: mealPlanEntries,
      recipe: {
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
      },
    })
    .from(mealPlanEntries)
    .leftJoin(recipes, eq(mealPlanEntries.recipeId, recipes.id))
    .where(
      and(
        eq(mealPlanEntries.userId, userId),
        eq(mealPlanEntries.date, date),
        eq(mealPlanEntries.mealType, mealType)
      )
    )
    .limit(1);

  if (entries.length === 0) {
    return null;
  }

  const row = entries[0];
  return {
    ...row.entry,
    recipe: row.recipe?.id ? row.recipe : null,
  };
}

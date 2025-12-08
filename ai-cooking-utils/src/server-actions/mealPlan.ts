"use server";

import {
  createMealPlanEntry,
  updateMealPlanEntry,
  deleteMealPlanEntry,
} from "@/server/mealPlan";
import { revalidatePath } from "next/cache";

export async function addMealPlanEntryAction(
  date: string,
  mealType: string,
  recipeId: number | null
) {
  await createMealPlanEntry({ date, mealType, recipeId });
  revalidatePath("/meal-plan");
}

export async function updateMealPlanEntryAction(
  id: number,
  recipeId: number | null
) {
  await updateMealPlanEntry(id, recipeId);
  revalidatePath("/meal-plan");
}

export async function deleteMealPlanEntryAction(id: number) {
  await deleteMealPlanEntry(id);
  revalidatePath("/meal-plan");
}

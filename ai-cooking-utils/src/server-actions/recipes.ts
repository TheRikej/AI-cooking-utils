"use server";

import { deleteRecipeById } from "@/server/recipes";
import { revalidatePath } from "next/cache";

export async function deleteRecipeAction(id: number) {
  await deleteRecipeById(id);
  revalidatePath("/recipes");
}

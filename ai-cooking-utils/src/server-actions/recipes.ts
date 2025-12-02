"use server";

import { deleteRecipeById } from "@/server/recipes";
import { revalidatePath } from "next/cache";

export async function deleteRecipeAction(id: number) {
  // TODO: when auth, check if the current user can delete this recipe
  await deleteRecipeById(id);
  revalidatePath("/recipes");
}

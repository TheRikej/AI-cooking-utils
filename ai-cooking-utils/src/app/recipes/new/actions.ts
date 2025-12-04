"use server";

import { redirect } from "next/navigation";
import { createRecipe } from "@/server/recipes";

export async function createRecipeAction(formData: FormData) {
  // TODO: replace with real authenticated user id
  const userId = "admin-1";

  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() || null;
  const ingredients = formData.get("ingredients")?.toString().trim() ?? "";
  const instructions = formData.get("instructions")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() || null;
  const isPublic = formData.get("isPublic") === "on";

  if (!title || !ingredients || !instructions) {
    throw new Error("Title, ingredients and instructions are required.");
  }

  await createRecipe({
    title,
    description,
    ingredients,
    instructions,
    isPublic,
    createdById: userId,
    imageUrl,
  });

  redirect("/recipes");
}

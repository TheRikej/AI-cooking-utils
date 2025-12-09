import { redirect } from "next/navigation";
import { updateRecipeById } from "@/server/recipes";

import { getAuthUser } from "@/server-actions/account";

async function editRecipeAction(recipeId: number, formData: FormData) {
  "use server";

  const user = getAuthUser();
  if (!user) {
    throw new Error("User must be authenticated to edit a recipe.");
  }
  const userId = (await user).id;

  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() || null;
  const ingredients = formData.get("ingredients")?.toString().trim() ?? "";
  const instructions = formData.get("instructions")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() || null;
  const isPublic = formData.get("isPublic") === "on";

  if (!title || !ingredients || !instructions) {
    throw new Error("Title, ingredients and instructions are required.");
  }

  await updateRecipeById({
    id: recipeId,
    title,
    description,
    ingredients,
    instructions,
    isPublic,
    imageUrl,
    userId,
  });

  redirect("/recipes");
}

export { editRecipeAction };
import { db } from "@/db";
import { recipes } from "@/db/schema/recipes";
import type { NewRecipe, Recipe } from "@/db/schema/recipes";
import { eq } from "drizzle-orm";

export async function readRecipes(): Promise<Recipe[]> {
  const rows = await db.select().from(recipes).orderBy(recipes.id);

  return rows;
}

export async function createRecipe(input: {
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  isPublic: boolean;
  createdById: string;
  imageUrl?: string | null;
}): Promise<Recipe> {
  const [created] = await db
    .insert(recipes)
    .values({
      title: input.title,
      description: input.description,
      ingredients: input.ingredients,
      instructions: input.instructions,
      isPublic: input.isPublic,
      createdById: input.createdById,
      imageUrl: input.imageUrl ?? null,
    } satisfies NewRecipe)
    .returning();

  return created;
}

export async function deleteRecipeById(id: number): Promise<void> {
  await db.delete(recipes).where(eq(recipes.id, id));
}

import { db } from "@/db";
import { recipes } from "@/db/schema/recipes";
import type { NewRecipe, Recipe } from "@/db/schema/recipes";
import { eq, or } from "drizzle-orm";
import { desc, and } from "drizzle-orm";

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
export type RecipeWithFavorite = Recipe & {
  isFavorite: boolean;
};

import { auth } from "@/auth";
import { favoriteRecipes } from "@/db/schema/favoriteRecipes";

type Filter = "all" | "favorites" | "mine";

export async function readRecipes(
  filter: Filter = "all"
): Promise<RecipeWithFavorite[]> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    const rows = await db.query.recipes.findMany({
      where: eq(recipes.isPublic, true),
      orderBy: (r, { desc }) => desc(r.createdAt),
    });

    return rows.map((r) => ({
      ...r,
      isFavorite: false,
    }));
  }

  if (filter === "favorites") {
    const rows = await db
      .select({
        recipe: recipes,
        favUserId: favoriteRecipes.userId,
      })
      .from(recipes)
      .innerJoin(
        favoriteRecipes,
        and(
          eq(favoriteRecipes.recipeId, recipes.id),
          eq(favoriteRecipes.userId, userId)
        )
      )
      .orderBy(desc(recipes.createdAt));

    return rows.map((row) => ({
      ...row.recipe,
      isFavorite: true,
    }));
  }

  if (filter === "mine") {
    const rows = await db
      .select({
        recipe: recipes,
        favUserId: favoriteRecipes.userId,
      })
      .from(recipes)
      .leftJoin(
        favoriteRecipes,
        and(
          eq(favoriteRecipes.recipeId, recipes.id),
          eq(favoriteRecipes.userId, userId)
        )
      )
      .where(eq(recipes.createdById, userId))
      .orderBy(desc(recipes.createdAt));

    return rows.map((row) => ({
      ...row.recipe,
      isFavorite: !!row.favUserId,
    }));
  }

  const rows = await db
    .select({
      recipe: recipes,
      favUserId: favoriteRecipes.userId,
    })
    .from(recipes)
    .leftJoin(
      favoriteRecipes,
      and(
        eq(favoriteRecipes.recipeId, recipes.id),
        eq(favoriteRecipes.userId, userId)
      )
    )
    .where(or(eq(recipes.isPublic, true), eq(recipes.createdById, userId)))
    .orderBy(desc(recipes.createdAt));

  return rows.map((row) => ({
    ...row.recipe,
    isFavorite: !!row.favUserId,
  }));
}

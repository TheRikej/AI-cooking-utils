import { db } from "@/db";
import { recipes } from "@/db/schema/recipes";
import type { NewRecipe, Recipe } from "@/db/schema/recipes";
import { eq, not, or } from "drizzle-orm";
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

export async function updateRecipeById(input: {
  id: number;
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  isPublic: boolean;
  imageUrl?: string | null;
  userId: string;
}): Promise<Recipe | null> {
  if (!await checkUserEditRights(input.id)) {
    throw new Error("User does not have rights to edit this recipe.");
  }

  const [updated] = await db
    .update(recipes)
    .set({
      title: input.title,
      description: input.description,
      ingredients: input.ingredients,
      instructions: input.instructions,
      isPublic: input.isPublic,
      imageUrl: input.imageUrl ?? null,
    })
    .where(and(eq(recipes.id, input.id),
      eq(recipes.createdById, input.userId)))
    .returning();

  return updated || null;
}


export async function deleteRecipeById(id: number): Promise<void> {
  if (await checkUserEditRights(id)) {
    await db.delete(recipes).where(eq(recipes.id, id));
  }
  else {
    throw new Error("User does not have rights to delete this recipe.");
  }
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

export async function readRecipeById(id: number): Promise<Recipe | null> {
  const session = await auth();
  const userId = session?.user ? session.user.id: "";

  const row = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, id), or(eq(recipes.createdById, userId), (recipes.isPublic))))  
    .limit(1);

  return row[0] || null;
}

export async function checkUserEditRights(recipeId: number): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return false;
  }

  const row = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, recipeId), eq(recipes.createdById, userId)))
    .limit(1);

  return row.length > 0;
}

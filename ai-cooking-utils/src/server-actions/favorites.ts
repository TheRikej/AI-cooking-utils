"use server";

import { db } from "@/db";
import { favoriteRecipes } from "@/db/schema/favoriteRecipes";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(recipeId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const userId = session.user.id;

  const existing = await db.query.favoriteRecipes.findFirst({
    where: and(
      eq(favoriteRecipes.userId, userId),
      eq(favoriteRecipes.recipeId, recipeId)
    ),
  });

  if (existing) {
    await db
      .delete(favoriteRecipes)
      .where(
        and(
          eq(favoriteRecipes.userId, userId),
          eq(favoriteRecipes.recipeId, recipeId)
        )
      );
  } else {
    await db.insert(favoriteRecipes).values({
      userId,
      recipeId,
    });
  }

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipeId}`);
}

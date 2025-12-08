import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { users, usersRelations } from "./schema/users";
import { recipes, recipesRelations } from "./schema/recipes";
import { mealPlanEntries, mealPlanEntriesRelations } from "./schema/mealPlan";
import { favoriteRecipes } from "./schema/favoriteRecipes";

if (typeof window !== "undefined") {
  throw new Error(
    "db/index.ts was imported on the client – this must be server-only."
  );
}

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema: {
    users,
    recipes,
    mealPlanEntries,
    favoriteRecipes,

    // relations
    usersRelations,
    recipesRelations,
    mealPlanEntriesRelations,
  },
});

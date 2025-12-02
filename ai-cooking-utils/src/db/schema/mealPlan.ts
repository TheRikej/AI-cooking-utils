import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { recipes } from "./recipes";

export const mealPlanEntries = sqliteTable("meal_plan_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  date: text("date").notNull(),

  mealType: text("meal_type").notNull(),

  recipeId: integer("recipe_id").references(() => recipes.id, {
    onDelete: "set null",
  }),

  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const mealPlanEntriesRelations = relations(
  mealPlanEntries,
  ({ one }) => ({
    user: one(users, {
      fields: [mealPlanEntries.userId],
      references: [users.id],
    }),
    recipe: one(recipes, {
      fields: [mealPlanEntries.recipeId],
      references: [recipes.id],
    }),
  })
);

export type MealPlanEntry = typeof mealPlanEntries.$inferSelect;
export type NewMealPlanEntry = typeof mealPlanEntries.$inferInsert;

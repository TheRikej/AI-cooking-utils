import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { mealPlanEntries } from "./mealPlan";

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  ingredients: text("ingredients").notNull(),
  instructions: text("instructions").notNull(),

  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),

  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  imageUrl: text("image_url"),

  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  author: one(users, {
    fields: [recipes.createdById],
    references: [users.id],
  }),
  mealPlanEntries: many(mealPlanEntries),
}));

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;

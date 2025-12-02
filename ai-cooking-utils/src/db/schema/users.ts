import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { recipes } from "./recipes";
import { mealPlanEntries } from "./mealPlan";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),

  role: text("role").notNull().default("USER"),

  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  mealPlanEntries: many(mealPlanEntries),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

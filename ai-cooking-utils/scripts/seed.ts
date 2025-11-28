import { db } from "@/db";
import { users, recipes, mealPlanEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

const today = new Date();
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

async function main() {
  console.log(" Starting seed...");

  // --- 1. Create ADMIN user ---
  const adminEmail = "admin@example.com";

  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail));

  let adminId = "admin-1";

  if (!existingAdmin) {
    await db.insert(users).values({
      id: adminId,
      email: adminEmail,
      name: "Admin User",
      role: "ADMIN",
    });
    console.log("Created admin user");
  } else {
    adminId = existingAdmin.id;
    console.log("Admin already exists");
  }

  // --- 2. Create some recipes ---
  const insertedRecipes = await db
    .insert(recipes)
    .values([
      {
        title: "Spaghetti Carbonara",
        description: "Classic Italian pasta with pancetta and eggs.",
        ingredients: "Spaghetti\nEggs\nPancetta\nParmesan\nBlack pepper",
        instructions:
          "1. Cook pasta.\n2. Mix eggs + cheese.\n3. Combine with pancetta.",
        isPublic: true,
        createdById: adminId,
      },
      {
        title: "Vegan Buddha Bowl",
        description: "Healthy bowl with quinoa, chickpeas, and veggies.",
        ingredients: "Quinoa\nChickpeas\nSpinach\nTahini\nLemon",
        instructions: "Cook quinoa, roast chickpeas, serve with sauce.",
        isPublic: true,
        createdById: adminId,
      },
      {
        title: "Grilled Chicken Wrap",
        description: "Simple healthy lunch wrap.",
        ingredients: "Flour wrap\nChicken\nLettuce\nTomato\nYogurt sauce",
        instructions: "Grill chicken, assemble wrap.",
        isPublic: false,
        createdById: adminId,
      },
    ])
    .returning();

  console.log(`Inserted ${insertedRecipes.length} recipes`);

  // --- 3. Create Meal Plan Entries for demo ---
  await db.insert(mealPlanEntries).values([
    {
      userId: adminId,
      date: formatDate(today),
      mealType: "lunch",
      recipeId: insertedRecipes[0].id,
    },
    {
      userId: adminId,
      date: formatDate(tomorrow),
      mealType: "dinner",
      recipeId: insertedRecipes[1].id,
    },
  ]);

  console.log("Created demo meal plan entries");

  console.log("🌱 Seed completed successfully");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});

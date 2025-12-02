import Link from "next/link";
import { readRecipes } from "@/server/recipes";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const recipes = await readRecipes();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Recipes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse your AI-generated and custom recipes. You can later filter
            public, private and favorites here.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/recipes/new">Add new recipe</Link>
        </Button>
      </header>

      {recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          You don’t have any recipes yet.{" "}
          <Button asChild variant="link" className="px-1">
            <Link href="/recipes/new">Create your first recipe.</Link>
          </Button>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}
    </div>
  );
}

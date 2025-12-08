import Link from "next/link";
import { readRecipes } from "@/server/recipes";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Filter = "all" | "favorites" | "mine";

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const filter = (resolvedSearchParams.filter as Filter) || "all";

  const recipes = await readRecipes(filter);

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

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              asChild
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
            >
              <Link href="/recipes">All</Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant={filter === "favorites" ? "default" : "outline"}
            >
              <Link
                href={{ pathname: "/recipes", query: { filter: "favorites" } }}
              >
                Favorites
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant={filter === "mine" ? "default" : "outline"}
            >
              <Link href={{ pathname: "/recipes", query: { filter: "mine" } }}>
                My recipes
              </Link>
            </Button>
          </div>
        </div>

        <Button asChild size="lg">
          <Link href="/recipes/new">Add new recipe</Link>
        </Button>
      </header>

      {recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          No recipes for this filter yet.{" "}
          <Button asChild variant="link" className="px-1">
            <Link href="/recipes/new">Create a recipe.</Link>
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

import { RecipeForm } from "@/components/recipes/recipe-form";
import { createRecipeAction } from "./actions";

export const dynamic = "force-dynamic";

export default function NewRecipePage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          New recipe
        </h1>
      </header>

      <RecipeForm action={createRecipeAction} submitButtonText="Save Recipe" enableAI/>
    </div>
  );
}

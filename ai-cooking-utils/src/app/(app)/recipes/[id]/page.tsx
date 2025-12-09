import { RecipeForm } from "@/components/recipes/recipe-form";
import { editRecipeAction } from "./actions";
import { checkUserEditRights, readRecipeById } from "@/server/recipes";

export const dynamic = "force-dynamic";

interface RecipePageProps {
  params: {
    id: number;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const {id: recipeId} = await params;

  const recipe = await readRecipeById(recipeId);
  const editRights = await checkUserEditRights(recipeId);

  if (!recipe) {
    return <div className="mx-auto w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Recipe not found
        </h1>
    </div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          New recipe
        </h1>
      </header>

      <RecipeForm action={editRecipeAction.bind(undefined, recipeId)} submitButtonText={editRights ? "Edit Recipe": ""} enableAI={false} recipe={recipe}/>
    </div>
  );
}

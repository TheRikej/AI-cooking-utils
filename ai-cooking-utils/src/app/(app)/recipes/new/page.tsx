import { NewRecipeForm } from "./new-recipe-form";

export const dynamic = "force-dynamic";

export default function NewRecipePage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          New recipe
        </h1>
        <p className="text-sm text-muted-foreground">
          You can either fill this out manually, or later we’ll add an AI
          assistant that helps you generate ingredients and instructions.
        </p>
      </header>

      <NewRecipeForm />
    </div>
  );
}

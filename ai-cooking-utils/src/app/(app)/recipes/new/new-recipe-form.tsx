import { redirect } from "next/navigation";
import { createRecipe } from "@/server/recipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAuthUser } from "@/server-actions/account";

async function createRecipeAction(formData: FormData) {
  "use server";

  const user = getAuthUser();
  if (!user) {
    throw new Error("User must be authenticated to create a recipe.");
  }
  const userId = (await user).id;

  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() || null;
  const ingredients = formData.get("ingredients")?.toString().trim() ?? "";
  const instructions = formData.get("instructions")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() || null;
  const isPublic = formData.get("isPublic") === "on";

  if (!title || !ingredients || !instructions) {
    throw new Error("Title, ingredients and instructions are required.");
  }

  await createRecipe({
    title,
    description,
    ingredients,
    instructions,
    isPublic,
    createdById: userId,
    imageUrl,
  });

  redirect("/recipes");
}

export function NewRecipeForm() {
  return (
    <form action={createRecipeAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <Input
          id="title"
          name="title"
          required
          placeholder="E.g. Spaghetti Carbonara"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          Short description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Quick description of the recipe..."
          rows={2}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="ingredients"
            className="text-sm font-medium text-foreground"
          >
            Ingredients
          </label>
          <Textarea
            id="ingredients"
            name="ingredients"
            required
            placeholder={`One ingredient per line, e.g.\n- 200 g spaghetti\n- 2 eggs\n- 50 g pancetta`}
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="instructions"
            className="text-sm font-medium text-foreground"
          >
            Instructions
          </label>
          <Textarea
            id="instructions"
            name="instructions"
            required
            placeholder={`Step-by-step instructions, e.g.\n1. Cook pasta.\n2. Fry pancetta.\n3. Mix eggs and cheese.\n4. Combine everything.`}
            rows={6}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="imageUrl"
          className="text-sm font-medium text-foreground"
        >
          Image URL (optional)
        </label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://example.com/my-dish.jpg"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPublic"
          name="isPublic"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 rounded border-muted bg-background"
        />
        <label htmlFor="isPublic" className="text-sm text-foreground">
          Make this recipe public
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" asChild>
          <a href="/recipes">Cancel</a>
        </Button>
        <Button type="submit">Save recipe</Button>
      </div>
    </form>
  );
}

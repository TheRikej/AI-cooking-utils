"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import AIDescriptionDialog from "@/components/AIDescriptionDialog";
import { Sparkles } from "lucide-react";
import { createRecipeAction } from "./actions";

interface RecipeData {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
}

export function NewRecipeForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const ingredientsRef = useRef<HTMLTextAreaElement>(null);
  const instructionsRef = useRef<HTMLTextAreaElement>(null);

  const handleAIGenerate = (recipe: RecipeData) => {
    if (titleRef.current) {
      titleRef.current.value = recipe.title;
    }
    if (descriptionRef.current) {
      descriptionRef.current.value = recipe.description;
    }
    if (ingredientsRef.current) {
      ingredientsRef.current.value = recipe.ingredients;
    }
    if (instructionsRef.current) {
      instructionsRef.current.value = recipe.instructions;
    }
  };

  return (
    <>
      <form action={createRecipeAction} className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate Recipe with AI
            </Button>
          </div>
          <Input
            ref={titleRef}
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
            ref={descriptionRef}
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
              ref={ingredientsRef}
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
              ref={instructionsRef}
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

      <AIDescriptionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </>
  );
}

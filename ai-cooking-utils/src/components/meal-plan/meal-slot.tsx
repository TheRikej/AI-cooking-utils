"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { MealPlanEntryWithRecipe } from "@/server/mealPlan";
import { RecipeSelectorDialog } from "./recipe-selector-dialog";
import {
  useAddMealPlanEntry,
  useUpdateMealPlanEntry,
  useDeleteMealPlanEntry,
} from "@/hooks/use-meal-plan";

interface MealSlotProps {
  date: string;
  mealType: string;
  entry?: MealPlanEntryWithRecipe;
}

export function MealSlot({ date, mealType, entry }: MealSlotProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addEntry = useAddMealPlanEntry();
  const updateEntry = useUpdateMealPlanEntry();
  const deleteEntry = useDeleteMealPlanEntry();

  const isLoading =
    addEntry.isPending || updateEntry.isPending || deleteEntry.isPending;

  const handleSelectRecipe = async (recipeId: number) => {
    try {
      if (entry) {
        await updateEntry.mutateAsync({ entryId: entry.id, recipeId });
      } else {
        await addEntry.mutateAsync({ date, mealType, recipeId });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error selecting recipe:", error);
    }
  };

  const handleRemove = async () => {
    if (!entry) return;

    try {
      await deleteEntry.mutateAsync(entry.id);
    } catch (error) {
      console.error("Error removing meal:", error);
    }
  };

  return (
    <>
      <div className="border rounded-lg p-2 min-h-[88px] flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-1 min-w-0">
          <span className="text-xs font-medium text-muted-foreground truncate">
            {mealType}
          </span>
          {entry?.recipe && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
              onClick={handleRemove}
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {entry?.recipe ? (
          <div
            onClick={() => setIsDialogOpen(true)}
            className="cursor-pointer hover:bg-muted p-1 rounded transition-colors flex-1 flex flex-col justify-center min-w-0"
          >
            <p className="text-sm font-medium line-clamp-2 break-words">
              {entry.recipe.title}
            </p>
            {entry.recipe.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 break-words">
                {entry.recipe.description}
              </p>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center min-w-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-auto py-2"
              onClick={() => setIsDialogOpen(true)}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-1 shrink-0" />
              <span className="truncate">Add meal</span>
            </Button>
          </div>
        )}
      </div>

      <RecipeSelectorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelect={handleSelectRecipe}
        currentRecipeId={entry?.recipeId ?? undefined}
      />
    </>
  );
}

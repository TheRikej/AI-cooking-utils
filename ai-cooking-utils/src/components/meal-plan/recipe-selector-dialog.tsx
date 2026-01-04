"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRecipes } from "@/hooks/use-recipes";

interface RecipeSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipeId: number) => void;
  currentRecipeId?: number;
}

export function RecipeSelectorDialog({
  isOpen,
  onClose,
  onSelect,
  currentRecipeId,
}: RecipeSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: recipes = [], isLoading } = useRecipes(isOpen);

  const filteredRecipes = useMemo(() => {
    if (searchQuery.trim() === "") {
      return recipes;
    }

    const query = searchQuery.toLowerCase();
    return recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query)
    );
  }, [searchQuery, recipes]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSelect = (recipeId: number) => {
    onSelect(recipeId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select a Recipe</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading recipes...
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No recipes found" : "No recipes available"}
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`border rounded-lg p-3 hover:bg-muted transition-colors cursor-pointer ${
                  currentRecipeId === recipe.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSelect(recipe.id)}
              >
                <h3 className="font-medium text-sm">{recipe.title}</h3>
                {recipe.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {recipe.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

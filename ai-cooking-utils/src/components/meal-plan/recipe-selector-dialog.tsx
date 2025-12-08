"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Recipe } from "@/db/schema/recipes";
import { Search } from "lucide-react";

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRecipes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRecipes(
        recipes.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(query) ||
            recipe.description?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, recipes]);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

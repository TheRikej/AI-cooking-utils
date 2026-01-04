import { useQuery } from "@tanstack/react-query";
import type { Recipe } from "@/db/schema/recipes";

export function useRecipes(enabled: boolean = true) {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await fetch("/api/recipes");

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      return response.json() as Promise<Recipe[]>;
    },
    enabled,
  });
}

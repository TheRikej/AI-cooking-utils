import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MealPlanEntryWithRecipe } from "@/server/mealPlan";
import {
  addMealPlanEntryAction,
  updateMealPlanEntryAction,
  deleteMealPlanEntryAction,
} from "@/server-actions/mealPlan";

interface UseMealPlanParams {
  startDate: string;
  endDate: string;
}

export function useMealPlan({ startDate, endDate }: UseMealPlanParams) {
  return useQuery({
    queryKey: ["meal-plan", startDate, endDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/meal-plan?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meal plan entries");
      }

      return response.json() as Promise<MealPlanEntryWithRecipe[]>;
    },
  });
}

export function useAddMealPlanEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      mealType,
      recipeId,
    }: {
      date: string;
      mealType: string;
      recipeId: number;
    }) => {
      return await addMealPlanEntryAction(date, mealType, recipeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan"] });
    },
  });
}

export function useUpdateMealPlanEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entryId,
      recipeId,
    }: {
      entryId: number;
      recipeId: number;
    }) => {
      return await updateMealPlanEntryAction(entryId, recipeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan"] });
    },
  });
}

export function useDeleteMealPlanEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: number) => {
      return await deleteMealPlanEntryAction(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan"] });
    },
  });
}

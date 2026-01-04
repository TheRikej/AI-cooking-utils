import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GenerateAIMealPlanParams {
  startDate: string;
  endDate: string;
  preferences: string;
}

export function useGenerateAIMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      startDate,
      endDate,
      preferences,
    }: GenerateAIMealPlanParams) => {
      const response = await fetch("/api/ai/generate-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          preferences,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate meal plan");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan"] });
    },
  });
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { MealPlanCalendar, getMonday, formatWeekRange } from "@/components/meal-plan/meal-plan-calendar";
import { AIMealPlanDialog } from "@/components/meal-plan/ai-meal-plan-dialog";
import type { MealPlanEntryWithRecipe } from "@/server/mealPlan";

export default function MealPlanPage() {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [entries, setEntries] = useState<MealPlanEntryWithRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getMonday(new Date())
  );

  useEffect(() => {
    fetchMealPlanEntries();
  }, []);

  const fetchMealPlanEntries = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const fourWeeksAgo = new Date(today);
      fourWeeksAgo.setDate(today.getDate() - 28);
      const fourWeeksAhead = new Date(today);
      fourWeeksAhead.setDate(today.getDate() + 28);

      const startDate = fourWeeksAgo.toISOString().split("T")[0];
      const endDate = fourWeeksAhead.toISOString().split("T")[0];

      const response = await fetch(
        `/api/meal-plan?startDate=${startDate}&endDate=${endDate}`
      );

      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Error fetching meal plan entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIGenerate = () => {
    fetchMealPlanEntries();
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading meal plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Meal Plan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan your meals for the week. Choose recipes manually or let AI
            generate a meal plan for you.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => setIsAIDialogOpen(true)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          AI Meal Plan
        </Button>
      </header>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{formatWeekRange(currentWeekStart)}</h2>
        <div className="flex items-center gap-2">
          <Button onClick={goToToday} variant="outline" size="sm">
            Today
          </Button>
          <Button
            onClick={goToPreviousWeek}
            variant="outline"
            size="icon"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={goToNextWeek}
            variant="outline"
            size="icon"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <MealPlanCalendar
        initialEntries={entries}
        onMutate={fetchMealPlanEntries}
        currentWeekStart={currentWeekStart}
      />

      <AIMealPlanDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}

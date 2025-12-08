"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MealSlot } from "./meal-slot";
import type { MealPlanEntryWithRecipe } from "@/server/mealPlan";

interface MealPlanDayProps {
  date: Date;
  entries: MealPlanEntryWithRecipe[];
  mealTypes: string[];
  onMutate?: () => void;
}

export function MealPlanDay({ date, entries, mealTypes, onMutate }: MealPlanDayProps) {
  const isToday =
    new Date().toDateString() === date.toDateString();

  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString("en-US", { month: "short" });

  const dateStr = date.toISOString().split("T")[0];

  return (
    <Card className={`min-w-0 ${isToday ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between min-w-0">
          <span className="font-semibold">
            {dayName}, {monthName} {dayNumber}
          </span>
          {isToday && (
            <span className="text-xs font-normal bg-primary text-primary-foreground px-2 py-0.5 rounded">
              Today
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 min-w-0">
        {mealTypes.map((mealType) => {
          const entry = entries.find((e) => e.mealType === mealType);
          return (
            <MealSlot
              key={mealType}
              date={dateStr}
              mealType={mealType}
              entry={entry}
              onMutate={onMutate}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

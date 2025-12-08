"use client";

import { MealPlanDay } from "./meal-plan-day";
import type { MealPlanEntryWithRecipe } from "@/server/mealPlan";

interface MealPlanCalendarProps {
  initialEntries: MealPlanEntryWithRecipe[];
  onMutate?: () => void;
  currentWeekStart: Date;
}

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function MealPlanCalendar({ initialEntries, onMutate, currentWeekStart }: MealPlanCalendarProps) {
  const weekDates = getWeekDates(currentWeekStart);

  const getEntriesForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return initialEntries.filter((entry) => entry.date === dateStr);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4" style={{
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
    }}>
        {weekDates.map((date) => (
          <MealPlanDay
            key={formatDate(date)}
            date={date}
            entries={getEntriesForDate(date)}
            mealTypes={MEAL_TYPES}
            onMutate={onMutate}
          />
        ))}
    </div>
  );
}

export function getMonday(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function formatWeekRange(currentWeekStart: Date): string {
  const endDate = new Date(currentWeekStart);
  endDate.setDate(endDate.getDate() + 6);

  const startMonth = currentWeekStart.toLocaleDateString("en-US", {
    month: "short",
  });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });

  if (startMonth === endMonth) {
    return `${startMonth} ${currentWeekStart.getDate()} - ${endDate.getDate()}, ${currentWeekStart.getFullYear()}`;
  }

  return `${startMonth} ${currentWeekStart.getDate()} - ${endMonth} ${endDate.getDate()}, ${currentWeekStart.getFullYear()}`;
}

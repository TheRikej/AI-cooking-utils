"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateAIMealPlan } from "@/hooks/use-ai-meal-plan";

interface AIMealPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIMealPlanDialog({
  isOpen,
  onClose,
}: AIMealPlanDialogProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preferences, setPreferences] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateMealPlan = useGenerateAIMealPlan();

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError("End date must be after start date");
      return;
    }

    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 14) {
      setError("Please select a range of 14 days or less");
      return;
    }

    setError(null);

    try {
      await generateMealPlan.mutateAsync({
        startDate,
        endDate,
        preferences: preferences || "balanced and healthy meals",
      });

      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setPreferences("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    generateMealPlan.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate AI Meal Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm font-medium mb-1"
            >
              Start Date
            </label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={generateMealPlan.isPending}
            />
          </div>

          <div>
            <label htmlFor="end-date" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={generateMealPlan.isPending}
              min={startDate}
            />
          </div>

          <div>
            <label
              htmlFor="preferences"
              className="block text-sm font-medium mb-1"
            >
              Dietary Preferences (Optional)
            </label>
            <Textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., vegetarian, low carb, gluten-free, high protein..."
              disabled={generateMealPlan.isPending}
              className="min-h-[80px]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            <strong>Note:</strong> The AI will create recipes and assign them to
            meals for the selected date range.
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={generateMealPlan.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!startDate || !endDate || generateMealPlan.isPending}
            >
              {generateMealPlan.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                "Generate Meal Plan"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

interface AIMealPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
}

export function AIMealPlanDialog({
  isOpen,
  onClose,
  onGenerate,
}: AIMealPlanDialogProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preferences, setPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          preferences: preferences || "balanced and healthy meals",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate meal plan");
      }

      onGenerate();
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!startDate || !endDate || isLoading}
            >
              {isLoading ? (
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

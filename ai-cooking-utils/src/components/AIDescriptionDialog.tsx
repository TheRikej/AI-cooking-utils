'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateRecipe } from '@/services/aiService';
import { Textarea } from "@/components/ui/textarea";
import { Button } from './ui/button';


interface RecipeData {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
}

interface AIRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (recipe: RecipeData) => void;
}

export default function AIDescriptionDialog({ 
  isOpen, 
  onClose, 
  onGenerate 
}: AIRecipeDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const recipe = await generateRecipe(prompt);
      if (isCanceled) return;
      onGenerate(recipe);
      onClose();
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPrompt('');
    setIsCanceled(true);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Generate Complete Recipe with AI</DialogTitle>
      </DialogHeader>
        
        <div className="mb-4">
          <label htmlFor="ai-prompt" className="block text-sm font-medium mb-2">
            What recipe would you like to create?
          </label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Spicy chicken pasta, Chocolate chip cookies, Beef stir-fry..."
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <strong>Note:</strong> This will fill in all recipe fields (title, description, ingredients, and instructions).
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100"
            // disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Recipe...
              </>
            ) : (
              'Generate Complete Recipe'
            )}
          </Button>
        </div>
    </DialogContent>
  </Dialog>
  );
}

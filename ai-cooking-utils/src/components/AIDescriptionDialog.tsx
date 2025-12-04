'use client';

import { useState } from 'react';
import { AIService } from '@/services/aiService';

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
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const recipe = await AIService.generateRecipe(prompt);
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
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Generate Complete Recipe with AI</h2>
        
        <div className="mb-4">
          <label htmlFor="ai-prompt" className="block text-sm font-medium mb-2">
            What recipe would you like to create?
          </label>
          <textarea
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
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
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
          </button>
        </div>
      </div>
    </div>
  );
}

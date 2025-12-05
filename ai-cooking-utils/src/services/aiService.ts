interface AIResponse {
  content: string;
  recipe: {
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
  };
  error?: string;
}

async function generateRecipe(prompt: string): Promise<AIResponse['recipe']> {
  const response = await fetch('/api/ai/generate-description', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data: AIResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate recipe');
  }

  return data.recipe;

  }
export { generateRecipe };

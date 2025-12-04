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

export class AIService {
  static async generateDescription(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data: AIResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate description');
      }

      return data.content;
    } catch (error) {
      console.error('Error generating AI description:', error);
      throw new Error('Failed to generate description. Please try again.');
    }
  }

  static async generateRecipe(prompt: string): Promise<AIResponse['recipe']> {
    try {
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
    } catch (error) {
      console.error('Error generating AI recipe:', error);
      throw new Error('Failed to generate recipe. Please try again.');
    }
  }
}

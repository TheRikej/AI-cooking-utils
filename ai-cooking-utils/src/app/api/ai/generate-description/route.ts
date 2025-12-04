import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Use Hugging Face's text generation model
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      messages: [
          {
            role: "user",
            content: `Generate recipe in the following JSON format:
            {
            "Title": "Recipe Title",
            "Description": "A brief description of the recipe",
            "Ingredients": "- ingredient 1\n- ingredient 2\n- ingredient 3",
            "Instructions": "1. Step one\n2. Step two\n3. Step three"
            }
            The user's recipe request: ${prompt}`}
          ], 
          model: "deepseek-ai/DeepSeek-V3.2:novita",

      // parameters: {
      //   max_new_tokens: 400,
      //   temperature: 0.8,
      //   do_sample: true,
      //           pad_token_id: 50256,
      //           stop: ["---", "Recipe:"]
      //         }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Hugging Face API error:', response.status, errorData);
      
      if (response.status === 503) {
        return NextResponse.json(
          { error: 'AI model is loading, please try again in a moment' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to generate recipe' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Create fallback recipe data
    const fallbackRecipe = {
      title: prompt,
      description: `A delicious ${prompt.toLowerCase()} recipe that combines wonderful flavors and textures. Perfect for any occasion and sure to impress your guests.`,
      ingredients: `- 2 cups main ingredient for ${prompt.toLowerCase()}\n- 1 tbsp olive oil or butter\n- 1 onion, diced\n- 2 cloves garlic, minced\n- Salt and pepper to taste\n- Fresh herbs for garnish`,
      instructions: `1. Heat oil or butter in a large pan over medium heat\n2. Add onion and cook until softened, about 3-4 minutes\n3. Add garlic and cook for another minute\n4. Add main ingredients and cook according to recipe requirements\n5. Season with salt, pepper, and desired spices\n6. Garnish with fresh herbs and serve immediately`
    };

    let generatedText = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    }

    let recipe = { ...fallbackRecipe };
    
    if (generatedText && generatedText.length > 100) {
      console.log('Generated text:', generatedText);
      
      // Extract the new recipe part (after the last "Recipe: ${prompt}")
      const lastRecipeIndex = generatedText.lastIndexOf(`Recipe: ${prompt}`);
      if (lastRecipeIndex !== -1) {
        const newRecipeText = generatedText.slice(lastRecipeIndex);
        
        // Extract title
        const titleMatch = newRecipeText.match(/Title:\s*([^\n]+)/);
        if (titleMatch && titleMatch[1].trim()) {
          recipe.title = titleMatch[1].trim();
        }
        
        // Extract description
        const descMatch = newRecipeText.match(/Description:\s*([^\n]+(?:\n(?!Ingredients:)[^\n]+)*)/);
        if (descMatch && descMatch[1].trim()) {
          recipe.description = descMatch[1].trim().replace(/\n/g, ' ');
        }
        
        // Extract ingredients
        const ingredMatch = newRecipeText.match(/Ingredients:\s*((?:\n?-[^\n]+)+)/);
        if (ingredMatch && ingredMatch[1].trim()) {
          const ingredientLines = ingredMatch[1].trim().split('\n').filter(line => line.trim());
          recipe.ingredients = ingredientLines.map(line => line.startsWith('-') ? line.trim() : `- ${line.trim()}`).join('\n');
        }
        
        // Extract instructions
        const instMatch = newRecipeText.match(/Instructions:\s*((?:\n?\d+\.[^\n]+)+)/);
        if (instMatch && instMatch[1].trim()) {
          const instructionLines = instMatch[1].trim().split('\n').filter(line => line.trim());
          recipe.instructions = instructionLines.map((line, index) => {
            const trimmed = line.trim();
            return trimmed.match(/^\d+\./) ? trimmed : `${index + 1}. ${trimmed}`;
          }).join('\n');
        }
      }
    }

    return NextResponse.json({ 
      content: recipe.description,
      recipe: recipe 
    });
  } catch (error) {
    console.error('Error in AI generation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

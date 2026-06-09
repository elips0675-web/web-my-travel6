'use server';

import { generateJSON } from '@/ai/gemini';

export interface AiRestaurantRecommendationsInput {
  destination: string;
  preferences: string;
  cuisineTypes?: string[];
}

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  location: string;
  description: string;
  price?: string;
  rating?: number;
  specialty?: string;
  imageUrl?: string;
}

export interface AiRestaurantRecommendationsOutput {
  recommendations: RestaurantRecommendation[];
}

export async function aiRestaurantRecommendations(input: AiRestaurantRecommendationsInput): Promise<AiRestaurantRecommendationsOutput> {
  const prompt = `You are an expert food critic and travel guide.
Based on the user's destination and preferences, suggest 5-7 suitable restaurants.

Consider the following details:
Destination: ${input.destination}
User Preferences: ${input.preferences}
Preferred Cuisine Types (if specified): ${input.cuisineTypes?.join(', ') || 'Any'}

For each recommendation, provide the following:
- Name: The name of the restaurant.
- Cuisine: The primary type of cuisine.
- Location: The address or neighborhood.
- Description: A brief, compelling description of the restaurant, its atmosphere, and what makes it special.
- Price: An estimated price for a meal in Belarusian Rubles (BYN), e.g., "50 BYN", "от 100 BYN".
- Rating: A star rating from 1 to 5.
- Specialty: A recommended dish or a notable feature.
- Image URL: Provide a placeholder image URL from \`https://picsum.photos/seed/{a-random-food-word}/800/600\`.

Ensure the recommendations are diverse and match the user's preferences as closely as possible. Respond in Russian.`;

  const schema = {
    type: 'object',
    properties: {
      recommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'The name of the restaurant.' },
            cuisine: { type: 'string', description: 'Type of cuisine.' },
            location: { type: 'string', description: 'Location of the restaurant.' },
            description: { type: 'string', description: 'Brief description.' },
            price: { type: 'string', description: 'Estimated meal price in BYN.' },
            rating: { type: 'number', description: 'Rating 1-5.' },
            specialty: { type: 'string', description: 'Specialty dish or feature.' },
            imageUrl: { type: 'string', description: 'Placeholder image URL.' },
          },
          required: ['name', 'cuisine', 'location', 'description'],
        },
      },
    },
    required: ['recommendations'],
  };

  return generateJSON<AiRestaurantRecommendationsOutput>(prompt, schema);
}

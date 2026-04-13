'use server';
/**
 * @fileOverview A Genkit flow for generating AI restaurant recommendations.
 *
 * - aiRestaurantRecommendations - A function that provides AI-driven restaurant recommendations.
 * - AiRestaurantRecommendationsInput - The input type for the function.
 * - AiRestaurantRecommendationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRestaurantRecommendationsInputSchema = z.object({
  destination: z.string().describe('The travel destination (city, country).'),
  preferences: z.string().describe('User preferences for restaurants, e.g., "italian food, romantic atmosphere, budget-friendly".'),
  cuisineTypes: z.array(z.string()).optional().describe('Preferred cuisine types, e.g., ["italian", "french", "japanese"]. If not specified, suggest a mix.'),
});
export type AiRestaurantRecommendationsInput = z.infer<typeof AiRestaurantRecommendationsInputSchema>;

const AiRestaurantRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the restaurant.'),
      cuisine: z.string().describe('The type of cuisine (e.g., "Italian", "French", "Japanese").'),
      location: z.string().describe('The location of the restaurant (address or area).'),
      description: z.string().describe('A brief description highlighting the key features and atmosphere.'),
      priceRange: z.string().optional().describe('An estimated price range (e.g., "$$", "$$$", "Affordable").'),
      rating: z.number().min(1).max(5).optional().describe('The rating of the restaurant on a scale of 1 to 5.'),
      specialty: z.string().optional().describe('A specialty dish or feature of the restaurant.'),
      imageUrl: z.string().url().optional().describe('A URL for an image of the restaurant.'),
    })
  ).describe('A list of recommended restaurants.'),
});
export type AiRestaurantRecommendationsOutput = z.infer<typeof AiRestaurantRecommendationsOutputSchema>;

export async function aiRestaurantRecommendations(input: AiRestaurantRecommendationsInput): Promise<AiRestaurantRecommendationsOutput> {
  return aiRestaurantRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRestaurantRecommendationsPrompt',
  input: {schema: AiRestaurantRecommendationsInputSchema},
  output: {schema: AiRestaurantRecommendationsOutputSchema},
  prompt: `You are an expert food critic and travel guide.
Based on the user's destination and preferences, suggest 5-7 suitable restaurants.

Consider the following details:
Destination: {{{destination}}}
User Preferences: {{{preferences}}}
Preferred Cuisine Types (if specified): {{{cuisineTypes}}}

For each recommendation, provide the following:
- Name: The name of the restaurant.
- Cuisine: The primary type of cuisine.
- Location: The address or neighborhood.
- Description: A brief, compelling description of the restaurant, its atmosphere, and what makes it special.
- Price Range: A price indicator like '₽', '₽₽', '₽₽₽'.
- Rating: A star rating from 1 to 5.
- Specialty: A recommended dish or a notable feature.
- Image URL: Provide a placeholder image URL from \`https://picsum.photos/seed/{a-random-food-word}/800/600\`.

Ensure the recommendations are diverse and match the user's preferences as closely as possible. Respond in Russian.`,
});

const aiRestaurantRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiRestaurantRecommendationsFlow',
    inputSchema: AiRestaurantRecommendationsInputSchema,
    outputSchema: AiRestaurantRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get restaurant recommendations from the AI.');
    }
    return output;
  }
);

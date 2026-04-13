'use server';
/**
 * @fileOverview A Genkit flow for generating AI housing recommendations.
 *
 * - aiHousingRecommendations - A function that provides AI-driven housing recommendations.
 * - AiHousingRecommendationsInput - The input type for the aiHousingRecommendations function.
 * - AiHousingRecommendationsOutput - The return type for the aiHousingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiHousingRecommendationsInputSchema = z.object({
  destination: z.string().describe('The travel destination (city, country, specific region).'),
  startDate: z.string().describe('The start date of the trip in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date of the trip in YYYY-MM-DD format.'),
  preferences: z.string().describe('User preferences for accommodation, e.g., "luxury, near city center, pet-friendly, budget-friendly, family-friendly".'),
  accommodationTypes: z.array(z.string()).optional().describe('Preferred accommodation types, e.g., ["hotel", "apartment", "hostel", "guesthouse"]. If not specified, suggest a mix.'),
});
export type AiHousingRecommendationsInput = z.infer<typeof AiHousingRecommendationsInputSchema>;

const AiHousingRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the accommodation.'),
      type: z.string().describe('The type of accommodation (e.g., hotel, apartment, hostel, guesthouse).'),
      description: z.string().describe('A brief description highlighting the key features and why it matches the user preferences.'),
      priceEstimate: z.string().optional().describe('An estimated price range per night (e.g., "$100-150" or "Budget").'),
      rating: z.number().min(1).max(5).optional().describe('The rating of the accommodation on a scale of 1 to 5.'),
      pros: z.array(z.string()).describe('A list of positive aspects of the accommodation.'),
      cons: z.array(z.string()).describe('A list of potential negative aspects or considerations.'),
    })
  ).describe('A list of recommended housing options.'),
});
export type AiHousingRecommendationsOutput = z.infer<typeof AiHousingRecommendationsOutputSchema>;

export async function aiHousingRecommendations(input: AiHousingRecommendationsInput): Promise<AiHousingRecommendationsOutput> {
  return aiHousingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHousingRecommendationsPrompt',
  input: {schema: AiHousingRecommendationsInputSchema},
  output: {schema: AiHousingRecommendationsOutputSchema},
  prompt: `You are an expert travel agent specializing in accommodation recommendations.\nBased on the user's destination, travel dates, and preferences, suggest 3-5 suitable housing options (hotels, apartments, hostels, guesthouses).\n\nConsider the following details:\nDestination: {{{destination}}}\nTravel Dates: From {{{startDate}}} to {{{endDate}}}\nUser Preferences: {{{preferences}}}\nPreferred Accommodation Types (if specified): {{{accommodationTypes}}}\n\nFor each recommendation, provide the following:\n- Name: The name of the accommodation.\n- Type: The type of accommodation (e.g., hotel, apartment, hostel, guesthouse).\n- Description: A brief, compelling description highlighting its key features and how it aligns with the user's preferences.\n- Price Estimate: An estimated price range per night (e.g., "$100-150" or "Budget").\n- Rating: A star rating from 1 to 5, if applicable.\n- Pros: A list of positive aspects.\n- Cons: A list of potential negative aspects or considerations.\n\nEnsure the recommendations are diverse if no specific accommodation types are requested. Focus on matching the user's preferences as closely as possible.`,
});

const aiHousingRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiHousingRecommendationsFlow',
    inputSchema: AiHousingRecommendationsInputSchema,
    outputSchema: AiHousingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get housing recommendations from the AI.');
    }
    return output;
  }
);

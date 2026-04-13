'use server';
/**
 * @fileOverview This file provides an AI-powered flow for generating personalized tour and excursion recommendations.
 *
 * - aiTourRecommendations - A function that handles the AI tour recommendation process.
 * - AiTourRecommendationsInput - The input type for the aiTourRecommendations function.
 * - AiTourRecommendationsOutput - The return type for the aiTourRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiTourRecommendationsInputSchema = z.object({
  destination: z.string().describe('The destination city or region for the trip.'),
  travelDates: z.object({
    start: z.string().datetime().describe('The start date of the trip in ISO 8601 format.'),
    end: z.string().datetime().describe('The end date of the trip in ISO 8601 format.'),
  }).describe('The travel dates for the trip.'),
  interests: z.array(z.string()).describe('A list of user interests, e.g., ["history", "food", "hiking"].'),
});
export type AiTourRecommendationsInput = z.infer<typeof AiTourRecommendationsInputSchema>;

const TourRecommendationSchema = z.object({
  name: z.string().describe('The name of the tour or excursion.'),
  description: z.string().describe('A brief description of the tour.'),
  type: z.string().describe('The type of activity, e.g., "cultural", "adventure", "food", "sightseeing".'),
  priceRange: z.string().describe('Estimated price range for the tour, e.g., "$", "$$", "$$$".'),
  bookingLink: z.string().url().describe('A hypothetical booking link for the tour.'),
  relevanceScore: z.number().min(0).max(100).describe('A score from 0 to 100 indicating how relevant this recommendation is to the user\'s interests and destination.'),
});

const AiTourRecommendationsOutputSchema = z.array(TourRecommendationSchema).describe('A list of personalized tour and excursion recommendations.');
export type AiTourRecommendationsOutput = z.infer<typeof AiTourRecommendationsOutputSchema>;

export async function aiTourRecommendations(input: AiTourRecommendationsInput): Promise<AiTourRecommendationsOutput> {
  return aiTourRecommendationsFlow(input);
}

const aiTourRecommendationsPrompt = ai.definePrompt({
  name: 'aiTourRecommendationsPrompt',
  input: { schema: AiTourRecommendationsInputSchema },
  output: { schema: AiTourRecommendationsOutputSchema },
  prompt: `You are an expert travel agent specializing in creating personalized tour and excursion recommendations.
Based on the user's travel plans and interests, generate a list of unique and relevant tours or activities.
Ensure the recommendations are suitable for the given destination and dates, and align with the specified interests.
For each recommendation, provide a name, a brief description, the type of activity, an estimated price range, a hypothetical booking link, and a relevance score.

Destination: {{{destination}}}
Travel Dates: From {{{travelDates.start}}} to {{{travelDates.end}}}
User Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Please provide the output as a JSON array matching the following schema:
{{{_output_schema}}}`,
});

const aiTourRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiTourRecommendationsFlow',
    inputSchema: AiTourRecommendationsInputSchema,
    outputSchema: AiTourRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await aiTourRecommendationsPrompt(input);
    return output!;
  }
);
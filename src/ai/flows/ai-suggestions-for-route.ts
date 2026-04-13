'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating AI suggestions for travel routes.
 *
 * - aiSuggestionsForRoute - A function that provides AI-driven suggestions for unique places and activities.
 * - AiSuggestionsForRouteInput - The input type for the aiSuggestionsForRoute function.
 * - AiSuggestionsForRouteOutput - The return type for the aiSuggestionsForRoute function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiSuggestionsForRouteInputSchema = z.object({
  destination: z.string().describe('The travel destination, e.g., "Paris, France".'),
  interests: z.array(z.string()).describe('A list of user interests, e.g., [
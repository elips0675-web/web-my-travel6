'use server';

import { generateJSON } from '@/ai/gemini';

export interface AiTourRecommendationsInput {
  destination: string;
  travelDates: { start: string; end: string };
  interests: string[];
}

export interface TourRecommendation {
  name: string;
  description: string;
  type: string;
  priceRange: string;
  bookingLink: string;
  relevanceScore: number;
  duration: string;
  groupSize: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  galleryImageUrls: string[];
}

export async function aiTourRecommendations(input: AiTourRecommendationsInput): Promise<TourRecommendation[]> {
  const prompt = `You are an expert travel agent. Generate a list of 5 personalized tour/excursion recommendations based on the user's criteria.

Destination: ${input.destination}
Travel Dates: From ${input.travelDates.start} to ${input.travelDates.end}
User Interests: ${input.interests.join(', ')}

For each recommendation, provide the following details:
- name: The name of the tour.
- description: A brief, engaging description (2-3 sentences).
- type: The type of activity (e.g., "cultural", "adventure", "food").
- priceRange: Estimated price per person in Belarusian Rubles (BYN), e.g., "150 BYN" or "от 200 BYN".
- bookingLink: A hypothetical booking link.
- relevanceScore: A score from 0 to 100 on how well it matches the user's interests.
- duration: Tour duration (e.g., "4 hours", "Full day").
- groupSize: Typical group size (e.g., "Small group (up to 12 people)").
- highlights: A list of 3-4 key highlights.
- included: A list of what is included (e.g., "Professional guide", "Transportation").
- excluded: A list of what is not included (e.g., "Lunch", "Gratuities").
- galleryImageUrls: A list of 4 placeholder image URLs from \`https://picsum.photos/seed/{a-random-word}/800/600\`. The first URL will be the main image. Ensure each URL has a unique random seed word.`;

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the tour or excursion.' },
        description: { type: 'string', description: 'A brief engaging description (2-3 sentences).' },
        type: { type: 'string', description: 'The type of activity.' },
        priceRange: { type: 'string', description: 'Estimated price per person in BYN.' },
        bookingLink: { type: 'string', description: 'A hypothetical booking link.' },
        relevanceScore: { type: 'number', description: 'Relevance score 0-100.' },
        duration: { type: 'string', description: 'Tour duration.' },
        groupSize: { type: 'string', description: 'Typical group size.' },
        highlights: { type: 'array', items: { type: 'string' }, description: 'Key highlights.' },
        included: { type: 'array', items: { type: 'string' }, description: 'What is included.' },
        excluded: { type: 'array', items: { type: 'string' }, description: 'What is excluded.' },
        galleryImageUrls: { type: 'array', items: { type: 'string' }, description: 'Placeholder image URLs.' },
      },
      required: ['name', 'description', 'type', 'priceRange', 'bookingLink', 'relevanceScore', 'duration', 'groupSize', 'highlights', 'included', 'excluded', 'galleryImageUrls'],
    },
  };

  return generateJSON<TourRecommendation[]>(prompt, schema);
}

'use server';

import { generateJSON } from '@/ai/gemini';

export interface AiHousingRecommendationsInput {
  destination: string;
  startDate: string;
  endDate: string;
  preferences: string;
  accommodationTypes?: string[];
}

export interface HousingRecommendation {
  name: string;
  type: string;
  location: string;
  description: string;
  priceEstimate?: string;
  rating?: number;
  pros: string[];
  cons: string[];
  imageUrl?: string;
}

export interface AiHousingRecommendationsOutput {
  recommendations: HousingRecommendation[];
}

export async function aiHousingRecommendations(input: AiHousingRecommendationsInput): Promise<AiHousingRecommendationsOutput> {
  const prompt = `You are an expert travel agent specializing in accommodation recommendations.
Based on the user's destination, travel dates, and preferences, suggest 3-5 suitable housing options (hotels, apartments, hostels, guesthouses).

Consider the following details:
Destination: ${input.destination}
Travel Dates: From ${input.startDate} to ${input.endDate}
User Preferences: ${input.preferences}
Preferred Accommodation Types (if specified): ${input.accommodationTypes?.join(', ') || 'Any'}

For each recommendation, provide the following:
- Name: The name of the accommodation.
- Type: The type of accommodation (e.g., hotel, apartment, hostel, guesthouse, Агротуризм).
- Location: The city or specific area where the accommodation is located.
- Description: A brief, compelling description highlighting its key features and how it aligns with the user's preferences.
- Price Estimate: An estimated price range per night in Belarusian Rubles (BYN) (e.g., "200-300 BYN" or "Бюджетно").
- Rating: A star rating from 1 to 5, if applicable.
- Pros: A list of 2-4 short, specific positive aspects (e.g., "Free WiFi", "Swimming Pool", "Near beach").
- Cons: A list of 1-2 potential negative aspects (e.g., "No parking", "Street noise").
- Image URL: Provide a placeholder image URL from \`https://picsum.photos/seed/{a-random-word}/800/600\`.

Ensure the recommendations are diverse if no specific accommodation types are requested. Focus on matching the user's preferences as closely as possible. Respond in Russian and use BYN for currency.`;

  const schema = {
    type: 'object',
    properties: {
      recommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'The name of the accommodation.' },
            type: { type: 'string', description: 'Type of accommodation.' },
            location: { type: 'string', description: 'Location of the accommodation.' },
            description: { type: 'string', description: 'Brief description.' },
            priceEstimate: { type: 'string', description: 'Estimated price range per night in BYN.' },
            rating: { type: 'number', description: 'Rating 1-5.' },
            pros: { type: 'array', items: { type: 'string' }, description: 'Positive aspects.' },
            cons: { type: 'array', items: { type: 'string' }, description: 'Negative aspects.' },
            imageUrl: { type: 'string', description: 'Placeholder image URL.' },
          },
          required: ['name', 'type', 'location', 'description', 'pros', 'cons'],
        },
      },
    },
    required: ['recommendations'],
  };

  return generateJSON<AiHousingRecommendationsOutput>(prompt, schema);
}

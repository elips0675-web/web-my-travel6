'use server';

import { generateJSON } from '@/ai/gemini';

export interface AiSuggestionsForRouteInput {
  destination: string;
  interests: string[];
}

export interface Suggestion {
  name: string;
  description: string;
  type: string;
}

export async function aiSuggestionsForRoute(input: AiSuggestionsForRouteInput): Promise<Suggestion[]> {
  const prompt = `You are an expert travel planner. Based on the user's destination and interests, suggest 4 unique places or activities.

Destination: ${input.destination}
Interests: ${input.interests.join(', ')}

Provide a diverse list of suggestions that might not be on every tourist's radar. For each suggestion, provide a name, a brief compelling description, and a type (e.g., Museum, Landmark, Activity, Walk, Restaurant).`;

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the suggested place or activity.' },
        description: { type: 'string', description: 'A brief description of the suggestion.' },
        type: { type: 'string', description: 'The type of suggestion, e.g., "Museum", "Landmark", "Restaurant", "Activity".' },
      },
      required: ['name', 'description', 'type'],
    },
  };

  return generateJSON<Suggestion[]>(prompt, schema);
}

'use server';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

export async function generateJSON<T>(prompt: string, schema: Record<string, unknown>): Promise<T> {
  if (!API_KEY) {
    throw new Error('GOOGLE_GENAI_API_KEY is not set');
  }

  const res = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        response_mime_type: 'application/json',
        response_schema: schema,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned empty response');
  }

  return JSON.parse(text) as T;
}

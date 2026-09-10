const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GenerateOptions {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
  responseSchema?: Record<string, unknown>;
}

export interface ContentPart {
  text: string;
}

export interface ContentMessage {
  role: 'user' | 'model';
  parts: ContentPart[];
}

interface GeminiCandidate {
  content?: {
    parts?: Array<{ text?: string }>;
  };
}

interface GeminiApiResponse {
  candidates?: GeminiCandidate[];
  error?: { message?: string };
}

export async function callGemini(
  messages: ContentMessage[],
  options: GenerateOptions = {},
  customApiKey?: string
): Promise<string> {
  const apiKey = customApiKey && customApiKey.trim().length > 0 ? customApiKey.trim() : process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please specify your Gemini API Key in Settings or configure GEMINI_API_KEY in server environment.'
    );
  }

  const model = options.model || GEMINI_MODEL;
  const endpoint = `${API_BASE_URL}/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: messages,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
      ...(options.responseSchema ? { responseSchema: options.responseSchema } : {}),
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error [HTTP ${response.status}]: ${errorBody}`);
  }

  const data = (await response.json()) as GeminiApiResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== 'string') {
    throw new Error('Gemini API returned an empty or malformed candidate text.');
  }

  return text;
}

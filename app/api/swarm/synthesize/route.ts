import { NextResponse } from 'next/server';
import { callGemini } from '@/shared/api';
import { buildSynthesisPrompt } from '@/entities/agent';
import type { PatternId } from '@/entities/pattern';

interface SynthesizeRequestBody {
  prompt?: unknown;
  patternId?: unknown;
  calibrationAnswers?: Record<string, string>;
  transcript?: Array<{ agentName: string; text: string; isHuman?: boolean }>;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SynthesizeRequestBody;
    const { prompt, patternId = 'fullstack-architecture', calibrationAnswers, transcript = [] } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Directive prompt is required.' }, { status: 400 });
    }

    const { systemInstruction, prompt: userPrompt } = buildSynthesisPrompt({
      userQuery: prompt,
      patternId: (patternId as PatternId) || 'fullstack-architecture',
      calibrationAnswers,
      transcript,
    });

    const headerKey = req.headers.get('x-gemini-api-key');
    const customApiKey = (headerKey || (body as { apiKey?: string }).apiKey || '').trim() || undefined;

    const synthesizedAnswer = await callGemini(
      [{ role: 'user', parts: [{ text: userPrompt }] }],
      {
        systemInstruction,
        temperature: 0.5,
      },
      customApiKey
    );

    return NextResponse.json({ answer: synthesizedAnswer });
  } catch (error) {
    console.error('Synthesis API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

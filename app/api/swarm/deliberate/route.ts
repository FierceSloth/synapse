import { NextResponse } from 'next/server';
import { callGemini } from '@/shared/api';
import { buildAgentDebatePrompt } from '@/entities/agent';
import type { PatternId } from '@/entities/pattern';
import type { AgentDebateMessage } from '@/entities/chat';

function getFormattedTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

interface DeliberateRequestBody {
  prompt?: unknown;
  patternId?: unknown;
  slotIndex?: unknown;
  agentName?: unknown;
  calibrationAnswers?: Record<string, string>;
  transcript?: Array<{ agentName: string; text: string; isHuman?: boolean }>;
  humanGuidance?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DeliberateRequestBody;
    const {
      prompt,
      patternId = 'fullstack-architecture',
      slotIndex = 1,
      agentName,
      calibrationAnswers,
      transcript = [],
      humanGuidance,
    } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Directive prompt is required.' }, { status: 400 });
    }

    if (!agentName || typeof agentName !== 'string') {
      return NextResponse.json({ error: 'Agent name is required.' }, { status: 400 });
    }

    const {
      systemInstruction,
      prompt: userPrompt,
      stageInfo,
    } = buildAgentDebatePrompt({
      patternId: (patternId as PatternId) || 'fullstack-architecture',
      agentName,
      slotIndex: Number(slotIndex),
      userQuery: prompt,
      calibrationAnswers,
      transcript,
      humanGuidance,
    });

    const headerKey = req.headers.get('x-gemini-api-key');
    const customApiKey = (headerKey || (body as { apiKey?: string }).apiKey || '').trim() || undefined;

    const responseText = await callGemini(
      [{ role: 'user', parts: [{ text: userPrompt }] }],
      {
        systemInstruction,
        temperature: 0.75,
      },
      customApiKey
    );

    const cleanedText = responseText.replace(/^["']|["']$/g, '').trim();

    const message: AgentDebateMessage = {
      slotIndex: Number(slotIndex),
      agentName,
      text: cleanedText,
      stageName: stageInfo.name,
      time: getFormattedTime(),
    };

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Deliberation API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

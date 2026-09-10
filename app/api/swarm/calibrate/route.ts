import { NextResponse } from 'next/server';
import { callGemini } from '@/shared/api';
import { buildCalibrationPrompt, isGreetingPrompt } from '@/entities/agent';
import type { PatternId } from '@/entities/pattern';
import type { ClarificationQuestion } from '@/entities/chat';

interface CalibrateRequestBody {
  prompt?: unknown;
  patternId?: unknown;
}

interface RawVectorItem {
  name?: string;
  title?: string;
  options?: string[];
  defaultOption?: string;
}

interface ParsedCalibrationOutput {
  needsCalibration?: boolean;
  skipReason?: string;
  vectors?: RawVectorItem[];
  questions?: RawVectorItem[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CalibrateRequestBody;
    const { prompt, patternId = 'fullstack-architecture' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Directive prompt is required.' }, { status: 400 });
    }

    const trimmedPrompt = prompt.trim();

    if (isGreetingPrompt(trimmedPrompt)) {
      return NextResponse.json({
        needsCalibration: false,
        questions: [],
        skipReason: 'Greeting or conversational inquiry',
      });
    }

    const { systemInstruction, prompt: userPrompt } = buildCalibrationPrompt(prompt, patternId as PatternId);

    const rawResponse = await callGemini([{ role: 'user', parts: [{ text: userPrompt }] }], {
      systemInstruction,
      temperature: 0.2,
      responseMimeType: 'application/json',
    });

    const cleaned = rawResponse
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let items: RawVectorItem[] = [];
    let needsCalibration = true;
    let skipReason = '';

    try {
      const parsed = JSON.parse(cleaned) as ParsedCalibrationOutput | RawVectorItem[];
      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (parsed && typeof parsed === 'object') {
        if (parsed.needsCalibration === false) {
          needsCalibration = false;
          skipReason = parsed.skipReason || '';
        }
        items = parsed.vectors || parsed.questions || [];
      }
    } catch (parseError) {
      console.error('Failed to parse calibration JSON:', cleaned, parseError);
    }

    if (!needsCalibration || items.length === 0) {
      return NextResponse.json({
        needsCalibration: false,
        questions: [],
        skipReason,
      });
    }

    const questions: ClarificationQuestion[] = items.map((item, idx: number) => {
      const slotNumber = String(idx + 1).padStart(2, '0');
      const rawName = (item.name || item.title || `Specification ${slotNumber}`).trim();
      const cleanName = rawName.replace(/^VECTOR\s*\d*\s*\[?|\]?$/gi, '').trim();
      const title = cleanName;

      const cleanOptions = (Array.isArray(item.options) ? item.options : [])
        .map((opt) =>
          String(opt)
            .replace(/^(Option\s+[A-Z][\s:.-]*|[A-Z]\)[\s.-]*|\d+[\s:.-]*)/i, '')
            .trim()
        )
        .filter(Boolean);

      const options =
        cleanOptions.length >= 2 ? cleanOptions : ['Default Mode', 'High Performance', 'Minimal Footprint'];

      return {
        id: `spec_${idx + 1}`,
        title,
        options,
        defaultOption: options[0],
      };
    });

    return NextResponse.json({
      needsCalibration: true,
      questions,
    });
  } catch (error) {
    console.error('Calibration API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { callGemini } from '@/shared/api';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { apiKey?: string };
    const headerKey = req.headers.get('x-gemini-api-key');
    const apiKey = (headerKey || body.apiKey || '').trim();

    const response = await callGemini(
      [{ role: 'user', parts: [{ text: 'Respond with the single word: ACTIVE' }] }],
      {
        temperature: 0.1,
      },
      apiKey || undefined
    );

    const isSuccess = response && response.length > 0;
    return NextResponse.json({
      success: isSuccess,
      source: apiKey ? 'custom' : 'env',
      message: isSuccess ? 'Neural link established successfully.' : 'No response from model.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to connect with Gemini API.';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

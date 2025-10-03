import { NextRequest, NextResponse } from 'next/server';

type ScanResult = {
  safe: boolean;
  percentages: Record<string, number>;
  summary?: string;
  model?: string;
  error?: string;
};

export async function POST(request: NextRequest) {
  console.log('[SCAN API] Received POST request');
  try {
    const body = await request.json();
    console.log('[SCAN API] Request body:', body);

    const { videoId } = body;

    if (!videoId || typeof videoId !== 'string') {
      console.log('[SCAN API] Invalid videoId:', videoId);
      return NextResponse.json({ error: 'Invalid videoId' }, { status: 400 });
    }

    console.log('[SCAN API] Processing videoId:', videoId);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('[SCAN API] Gemini API key not configured');
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    console.log('[SCAN API] API key found, calling Gemini');

    const prompt = `You are a content safety classifier. Analyze a YouTube video with id: ${videoId}.
Only return strict JSON with keys: safe (boolean), percentages (object with keys among ["AdultOriented","Violence","NonTraditionalRelationships","Profanity","Other"] and values from 0 to 1 indicating likelihood), summary (short string).
If uncertain, set safe to false, set percentages to low values for suspected categories, and provide a short summary.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    console.log('[SCAN API] Gemini URL:', geminiUrl.replace(apiKey, '[REDACTED]'));

    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    });

    console.log('[SCAN API] Gemini response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.log('[SCAN API] Gemini error response:', errorText);
      throw new Error(`Gemini API request failed: ${res.status}`);
    }

    const data = await res.json();
    console.log('[SCAN API] Gemini response data:', data);

    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.log('[SCAN API] No content from Gemini');
      throw new Error('No content from Gemini');
    }

    console.log('[SCAN API] Gemini text response:', text);

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      console.log('[SCAN API] Malformed response from Gemini');
      throw new Error('Malformed response from Gemini');
    }

    const obj = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    console.log('[SCAN API] Parsed Gemini result:', obj);

    const result: ScanResult = {
      safe: Boolean(obj.safe),
      percentages: obj.percentages && typeof obj.percentages === 'object' ? obj.percentages : {},
      summary: typeof obj.summary === 'string' ? obj.summary : undefined,
      model: 'gemini-1.5-pro',
    };

    console.log('[SCAN API] Final result:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[SCAN API] Error:', error);
    const result: ScanResult = {
      safe: false,
      percentages: { Other: 1 },
      summary: 'Scan unavailable',
      model: 'gemini-1.5-pro',
      error: String(error?.message ?? error),
    };
    return NextResponse.json(result, { status: 500 });
  }
}

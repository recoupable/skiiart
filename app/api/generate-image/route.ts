// app/api/generate-image/route.ts
import { NextResponse } from 'next/server';
import { generateImage } from '@/lib/replicate';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const imageUrl = await generateImage(prompt);

  if (imageUrl) {
    return NextResponse.json({ imageUrl }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
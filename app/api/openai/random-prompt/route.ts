import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    // Log the API key to check if it's being picked up
    console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

    // Use GPT-4 to generate a single random/funny prompt for LuhTyler
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `
            Generate a single, visually striking and detailed prompt for a custom image of 'LuhTyler'.
            The scene should alternate between epic, cinematic, or whimsical themes, but the prompt should focus on one idea at a time.
            The scene should be either hilarious, grand, or awe-inspiring, placing 'LuhTyler' in a unique, over-the-top situation.
            Ensure that the generated prompt is concise, no more than 20 words, and focuses on just one unique, creative idea.
            Focus on dynamic, cinematic, or photorealistic scenes depending on the mood of the scene.`
        },
      ],
    });

    const generatedPrompt = response.choices[0].message.content.trim();

    // Add caching headers to prevent stale data
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    };

    return NextResponse.json({ prompt: generatedPrompt }, { headers });
  } catch (error) {
    console.error('Error generating random prompt:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' });
  }
}
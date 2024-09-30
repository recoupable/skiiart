export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'edge';

import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    // Log the start of the API call with timestamp
    const requestTime = new Date().toISOString();
    console.log(`API Request initiated at: ${requestTime}`);

    // Log the API key being used (you can remove this in production for security)
    console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

    // Use GPT-4 to generate the random/funny part of the prompt for LuhTyler with a timestamp
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `
            Generate a visually striking and detailed prompt for a custom image of 'LuhTyler'.
            (Request Time: ${requestTime})
            Alternate between epic, cinematic, or whimsical themes, but the prompt should focus on one idea at a time.
            The scene should either be hilarious, grand, or awe-inspiring, placing 'LuhTyler' in a unique, over-the-top situation.
            Ensure that the prompt is no more than 20 words, concise, and gives clear visual direction with a single focal point.
            Focus on dynamic, cinematic, or photorealistic scenes depending on the mood of the scene.`
        },
      ],
    });

    // Log the response from OpenAI
    console.log('OpenAI API response:', response);

    // Check if response and choices are valid
    if (response && response.choices && response.choices[0]?.message?.content) {
      const generatedPrompt = response.choices[0].message.content.trim();

      // Log the generated prompt for debugging
      console.log('Generated prompt:', generatedPrompt);

      // Explicitly set cache control headers in the response
      const headers = new Headers({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      });

      return new NextResponse(JSON.stringify({ prompt: generatedPrompt }), { headers });
    } else {
      throw new Error('Invalid response from OpenAI');
    }
  } catch (error) {
    console.error('Error generating random prompt:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' });
  }
}
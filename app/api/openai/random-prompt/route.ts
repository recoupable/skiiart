import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    // Use GPT-3.5 to generate a funny or epic prompt for Luh Tyler
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `
            Generate a funny or epic prompt for a custom image of 'LuhTyler'. 
            The scene should be either hilarious or incredibly epic, placing him in over-the-top, unique situations. 
            Example ideas: 
              - 'LuhTyler' saving the world from a meteor with a boombox.
              - 'LuhTyler' riding a giant squirrel through a city made of waffles.
              - 'LuhTyler' as a space pirate, standing on an asteroid while gazing at a galaxy in the distance.
              - 'LuhTyler' surfing on a tidal wave made of fire, with a dragon flying overhead.
            The prompt should be no more than 50 words, detailed but concise, and inspire a sense of humor or epicness.`
        },
      ],
    });

    const generatedPrompt = response.choices[0].message.content;
    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Error generating random prompt:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' });
  }
}
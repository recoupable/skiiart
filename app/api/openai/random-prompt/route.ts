import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    // Use GPT-3.5/4 to generate the random/funny part of the prompt for Luh Tyler
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `
  Generate a visually striking and detailed prompt for a custom image of 'LuhTyler'.
  Alternate between epic, cinematic, or whimsical themes, but the prompt should focus on one idea at a time.
  The scene should either be hilarious, grand, or awe-inspiring, placing 'LuhTyler' in a unique, over-the-top situation.
  Example ideas:
    - 'LuhTyler' standing in front of a futuristic city, holding a boombox, with laser beams shooting from his sunglasses.
    - 'LuhTyler' as a Renaissance knight in shining armor, posing confidently in a grand castle hall with stained glass windows.
    - 'LuhTyler' riding a massive dragon through the clouds, with the sun setting in the background, casting epic light.
    - 'LuhTyler' DJ-ing in space, with planets and stars in the background, wearing futuristic gear.
    - 'LuhTyler' leading a parade of robots, with fireworks lighting up the sky.

  Ensure that the prompt is no more than 20 words, concise, and gives clear visual direction with a single focal point.
  Focus on dynamic, cinematic, or photorealistic scenes depending on the mood of the scene.`
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
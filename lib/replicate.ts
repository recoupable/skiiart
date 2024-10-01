export async function generateImage(prompt: string): Promise<string | null> {
    const apiUrl = 'https://api.replicate.com/v1/predictions';
    
    console.log('Starting image generation with prompt:', prompt);
    
    // The hidden consistent part of the prompt
    const hiddenPromptPart = "LuhTyler must be the main focus of the image, looking cool, confident, and powerful in a photo-realistic, high-quality style.";

    // Combine the random part of the prompt with the hidden rules
    const fullPrompt = `${prompt}. ${hiddenPromptPart}`;

    const data = {
      version: "fc17a0972374f75888ff85093f283e12501f01fce99486add1fbef0fb76eeaba", 
      input: {
        prompt: fullPrompt,  // Use the combined prompt
        aspect_ratio: "9:16", 
        num_outputs: 1,
        guidance_scale: 8,
        num_inference_steps: 28,
        output_format: "png",
      }
    };

    try {
      const startResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!startResponse.ok) {
        const errorDetails = await startResponse.text();
        console.error(`Failed to start image generation: ${startResponse.status} - ${errorDetails}`);
        return null;
      }

      const startResult = await startResponse.json();
      const getStatusUrl = startResult.urls.get;

      console.log('Initial response from Replicate:', startResult);

      let predictionResult;
      let status = 'starting';
      while (status !== 'succeeded' && status !== 'failed') {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusResponse = await fetch(getStatusUrl, {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        });

        predictionResult = await statusResponse.json();
        status = predictionResult.status;

        console.log('Polling Replicate API status:', predictionResult);
      }

      if (status === 'succeeded' && predictionResult.output && predictionResult.output[0]) {
        return predictionResult.output[0];
      } else {
        console.error('Image generation failed or no output returned');
        return null;
      }
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
}
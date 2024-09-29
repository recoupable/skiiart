export async function generateImage(prompt: string): Promise<string | null> {
    const apiUrl = 'https://api.replicate.com/v1/predictions';
  
    const data = {
      version: "fc17a0972374f75888ff85093f283e12501f01fce99486add1fbef0fb76eeaba", // Correct model version ID
      input: {
        prompt,
        aspect_ratio: "9:16", // Adjust this as needed
        num_outputs: 1,
        guidance_scale: 7,
        num_inference_steps: 28,
        output_format: "png",
      }
    };
  
    try {
      // Send the initial request to start the prediction
      const startResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,  // Your Replicate API Key
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
  
      // Poll the status of the prediction
      let predictionResult;
      let status = 'starting';
      while (status !== 'succeeded' && status !== 'failed') {
        // Wait for 2 seconds before polling
        await new Promise((resolve) => setTimeout(resolve, 2000));
  
        const statusResponse = await fetch(getStatusUrl, {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
          },
        });
  
        predictionResult = await statusResponse.json();
        status = predictionResult.status;
  
        console.log('Polling Replicate API status:', predictionResult);
      }
  
      // Check if the prediction succeeded
      if (status === 'succeeded' && predictionResult.output && predictionResult.output[0]) {
        return predictionResult.output[0]; // Return the generated image URL
      } else {
        console.error('Image generation failed or no output returned');
        return null;
      }
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }
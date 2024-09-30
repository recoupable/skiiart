'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wand2, Lightbulb, Shuffle, X, Download, Share } from 'lucide-react';
import Image from 'next/image';

const backgroundImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-fy15mx7sk5rj40cj6rwr93rmnw-1-4HBrNDjxialgYM8Yr4pKvPyYbw3YQG.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-2fqwd83d35rj20cj6s0aev513w-2-fMxpya9VY6uhiHlglpDUlRKZd4U6Ay.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-mykwbygsj9rj20cj6rzavtc5hc-0-IDf6C7EsFOaX86ev4nav5FYaH7gCRC.png"
];

export default function Component() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hiddenPromptPart = "LuhTyler must be the central focus of the image, exuding confidence, style, and power. The image should be cinematic, with dramatic lighting, vibrant colors, and a high level of detail. Make sure the image is polished, photo-realistic, and visually striking. The background should complement the scene but not overpower LuhTyler, enhancing his presence as the main character. Prioritize clean, well-composed scenes to ensure LuhTyler stands out as the hero of the image.";

  const changeBackgroundImage = useCallback(() => {
    setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(changeBackgroundImage, 10000);
    return () => clearInterval(intervalId);
  }, [changeBackgroundImage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleRandomize = async () => {
    setIsRandomizing(true);
    setPrompt('Randomizing...');
    try {
      // Use Date.now() to prevent caching by adding a unique timestamp to the request
      const response = await fetch(`/api/openai/random-prompt?${Date.now()}`);
      const data = await response.json();

      if (data.prompt) {
        setPrompt(data.prompt); // Set only the new random prompt
      } else {
        console.error('Failed to generate prompt:', data.error);
        setPrompt('Failed to generate prompt');
      }
    } catch (error) {
      console.error('Error fetching random prompt:', error);
      setPrompt('Error generating prompt');
    }
    setIsRandomizing(false);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setShowLightbox(true); // Open lightbox as soon as the submit button is pressed

    // Combine the random part and the hidden part of the prompt
    const fullPrompt = `${prompt}. ${hiddenPromptPart}`;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }), // Send the full prompt
      });

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setIsLoading(false);
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated-image.png';
      link.click();
    }
  };

  const shareImage = () => {
    if (navigator.share && generatedImage) {
      navigator.share({
        title: 'Check out this image!',
        url: generatedImage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <div className="relative h-screen">
        {backgroundImages.map((image, index) => (
          <Image 
            key={index}
            src={image}
            alt={`Background slideshow ${index + 1}`}
            fill
            className={`absolute inset-0 object-cover transition-opacity duration-2000 ${index === currentBackgroundIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="relative z-10 h-full bg-black bg-opacity-30 text-white flex flex-col justify-between p-6">
          <header className="container mx-auto text-center pt-4">
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SkiiArt-9-27-2024-3K8GqXJES1Cr9ckA4rXR0oUBKV8Cuy.png" 
              alt="SkiiArt Logo" 
              width={288}
              height={72}
              className="mx-auto"
            />
          </header>

          <main className="container mx-auto text-center max-w-2xl flex flex-col items-center justify-center h-full">
            <div className="relative w-full mb-4">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Bring Luh Tyler to life! Type your idea..."
                className="w-full py-4 px-6 rounded-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg placeholder-white placeholder-opacity-70 pr-14"
                style={{
                  minHeight: '80px',
                  paddingBottom: '50px',
                  overflowY: 'hidden',
                }}
                disabled={isRandomizing}
              />
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <button
                  onClick={handleRandomize}
                  className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors duration-200 rounded-lg"
                  disabled={isRandomizing}
                >
                  <Shuffle size={24} className="text-white" />
                </button>
              </div>
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors duration-200 rounded-lg"
                >
                  {isLoading ? (
                    <Shuffle className="animate-spin" size={24} />
                  ) : (
                    <Wand2 size={24} className="text-white" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center mb-4">
              <div className="flex items-center text-white text-xs">
                <Lightbulb className="mr-2 flex-shrink-0" size={16} />
                <p>
                  Include trigger word <strong>&#39;LuhTyler&#39;</strong> in your prompt.
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Lightbox for the generated image */}
        {showLightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative w-[90vw] max-w-[540px] h-auto">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Loading animation */}
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                  {/* Added text */}
                  <p className="text-white text-sm">Images take about 20 seconds to generate.</p>
                </div>
              ) : generatedImage ? (
                <>
                  <Image 
                    src={generatedImage}
                    alt="Generated Art"
                    layout="responsive"
                    width={16} 
                    height={9} 
                    className="object-contain max-h-[80vh]" // Constrain image within lightbox
                  />
                  <button
                    onClick={() => setShowLightbox(false)}
                    className="absolute top-2 right-2 bg-white bg-opacity-30 text-black p-2 rounded-full hover:bg-opacity-50 backdrop-blur-sm transition duration-300"
                  >
                    <X size={24} />
                  </button>
                  <button
                    onClick={shareImage}
                    className="absolute bottom-2 left-2 bg-white bg-opacity-30 text-black p-2 rounded-full hover:bg-opacity-50 backdrop-blur-sm transition duration-300"
                  >
                    <Share size={24} />
                  </button>
                  <button
                    onClick={downloadImage}
                    className="absolute bottom-2 right-2 bg-white bg-opacity-30 text-black p-2 rounded-full hover:bg-opacity-50 backdrop-blur-sm transition duration-300"
                  >
                    <Download size={24} />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Wand2, Lightbulb, Shuffle, X, Download } from 'lucide-react'

const backgroundImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-fy15mx7sk5rj40cj6rwr93rmnw-1-4HBrNDjxialgYM8Yr4pKvPyYbw3YQG.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-2fqwd83d35rj20cj6s0aev513w-2-fMxpya9VY6uhiHlglpDUlRKZd4U6Ay.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-mykwbygsj9rj20cj6rzavtc5hc-0-IDf6C7EsFOaX86ev4nav5FYaH7gCRC.png"
]

export function SkiiartWithUpdatedSubmitIcon() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const changeBackgroundImage = useCallback(() => {
    setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(changeBackgroundImage, 10000) // Change image every 10 seconds
    return () => clearInterval(intervalId)
  }, [changeBackgroundImage])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height based on content
    }
  }, [prompt])

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const result = await response.json()
      setGeneratedImage(result.imageUrl) // Set the generated image URL
    } catch (error) {
      console.error('Error generating image:', error)
    }
    setIsLoading(false)
  }

  const handleRandomize = () => {
    const randomPrompts = [
      "LuhTyler standing on the moon, gazing at Earth in the distance with a slight glow illuminating his figure. The surface of the moon is textured with craters, and the deep black sky is filled with distant stars.",
      "LuhTyler album cover with bold, neon hues. He is centered, wearing futuristic streetwear with vibrant details, against an abstract background of geometric patterns and electric lights, with a spotlight highlighting his silhouette.",
      "LuhTyler walking through a neon city at night. The buildings are towering, with glowing advertisements and flickering lights reflecting off wet streets, while he walks confidently through the vibrant atmosphere.",
      "LuhTyler skiing down a snow-covered mountain with dramatic motion. The bright sunlight gleams off the snow, casting long shadows as he speeds downhill, with powder flying up around him.",
      "LuhTyler in a cyberpunk city, surrounded by towering skyscrapers covered in holographic billboards. Neon lights cast sharp reflections across his face as he walks through the chaotic, tech-filled environment."
    ]
    setPrompt(randomPrompts[Math.floor(Math.random() * randomPrompts.length)])
  }

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'generated-image.png'
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <div className="relative h-screen">
        {backgroundImages.map((image, index) => (
          <img 
            key={index}
            src={image}
            alt={`Background slideshow ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${index === currentBackgroundIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="relative z-10 h-full bg-black bg-opacity-30 text-white flex flex-col justify-between p-6">
          <header className="container mx-auto text-center pt-4">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SkiiArt-9-27-2024-3K8GqXJES1Cr9ckA4rXR0oUBKV8Cuy.png" 
              alt="SkiiArt Logo" 
              className="mx-auto w-64 sm:w-72 h-auto"
            />
          </header>

          <main className="container mx-auto text-center max-w-2xl mb-8">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Generate my art..."
                className="w-full py-4 px-6 rounded-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg placeholder-white placeholder-opacity-70 pr-14"
                style={{
                  minHeight: '64px', // Minimum height
                  paddingBottom: '50px', // Add space for buttons
                  overflowY: 'hidden', // Hide scrollbar
                }}
              />
              {/* Randomize button */}
              <div className="absolute bottom-4 left-6">
                <button
                  onClick={handleRandomize}
                  className="text-white text-opacity-70 hover:text-opacity-100 transition-opacity duration-200 flex items-center"
                >
                  <Shuffle className="mr-2" size={16} />
                  <span className="text-xs">Randomize</span>
                </button>
              </div>

              {/* Submit button */}
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
          </main>

          <div className="flex justify-center items-center">
            <div className="flex items-center text-white text-xs">
              <Lightbulb className="mr-2 flex-shrink-0" size={16} />
              <p>
                Include trigger word <strong>'LuhTyler'</strong> in your prompt.
              </p>
            </div>
          </div>
        </div>

        {/* Generated Image Modal */}
        {generatedImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ease-in-out">
            <div className="relative max-w-md w-full p-6 bg-white bg-opacity-20 backdrop-blur-lg border border-opacity-30 rounded-lg shadow-lg">
              <img 
                src={generatedImage}
                alt="Generated Art" 
                className="w-full h-auto rounded-md mb-4"
              />
              {/* Close button */}
              <button
                onClick={() => setGeneratedImage(null)}
                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-300 transition duration-300"
              >
                <X size={24} />
              </button>
              {/* Download button */}
              <button
                onClick={downloadImage}
                className="flex items-center justify-center bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
              >
                <Download className="mr-2" size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
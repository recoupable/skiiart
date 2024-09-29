'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Wand2, Lightbulb, Shuffle, X, Download } from 'lucide-react'
import Image from 'next/image'

const backgroundImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-fy15mx7sk5rj40cj6rwr93rmnw-1-4HBrNDjxialgYM8Yr4pKvPyYbw3YQG.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-2fqwd83d35rj20cj6s0aev513w-2-fMxpya9VY6uhiHlglpDUlRKZd4U6Ay.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-mykwbygsj9rj20cj6rzavtc5hc-0-IDf6C7EsFOaX86ev4nav5FYaH7gCRC.png"
]

export default function Component() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRandomizing, setIsRandomizing] = useState(false)  // Loading state for randomizing
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0)
  const [showImageBox, setShowImageBox] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)  // For full-screen lightbox
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
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  const handleRandomize = async () => {
    setIsRandomizing(true)  // Set loading state to true
    setPrompt('Randomizing...')  // Show "randomizing..." in the textarea
    try {
      const response = await fetch('/api/openai/random-prompt')  // Call the random prompt API
      const data = await response.json()

      if (data.prompt) {
        setPrompt(data.prompt)  // Set the generated prompt in the textarea
      } else {
        console.error('Failed to generate prompt:', data.error)
        setPrompt('Failed to generate prompt')
      }
    } catch (error) {
      console.error('Error fetching random prompt:', error)
      setPrompt('Error generating prompt')
    }
    setIsRandomizing(false)  // Set loading state to false
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setShowImageBox(true)
    try {
      // Make API call to generate the image
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setGeneratedImage(data.imageUrl); // Set the generated image URL
      setIsLightboxOpen(true); // Open the lightbox automatically after image is generated
    } catch (error) {
      console.error('Error generating image:', error)
    }
    setIsLoading(false)
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
          <Image 
            key={index}
            src={image}
            alt={`Background slideshow ${index + 1}`}
            fill  // Replaces layout="fill"
            className={`absolute inset-0 transition-opacity duration-2000 ${index === currentBackgroundIndex ? 'opacity-100' : 'opacity-0'}`}
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

          <main className="container mx-auto text-center max-w-2xl flex flex-col items-center justify-end h-full pb-8">
            {showImageBox && (
              <div className="relative w-80 h-[500px] rounded-lg overflow-hidden bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 mb-6">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : generatedImage ? (
                  <>
                    <Image 
                      src={generatedImage}
                      alt="Generated Art" 
                      fill  // Replaces layout="fill"
                      className="cursor-pointer"
                      onClick={() => setIsLightboxOpen(true)}  // Open lightbox on click
                    />
                    <button
                      onClick={() => setShowImageBox(false)}
                      className="absolute top-2 right-2 bg-white bg-opacity-20 text-white p-1 rounded-full hover:bg-opacity-30 transition duration-300"
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={downloadImage}
                      className="absolute bottom-2 right-2 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition duration-300"
                    >
                      <Download size={20} />
                    </button>
                  </>
                ) : null}
              </div>
            )}
            <div className="relative w-full">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Bring Luh Tyler to life in any scene you dream up! Type your idea here to begin..."
                className="w-full py-4 px-6 rounded-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg placeholder-white placeholder-opacity-70 pr-14"
                style={{
                  minHeight: '80px',
                  paddingBottom: '50px',
                  overflowY: 'hidden',
                }}
                disabled={isRandomizing}  // Disable typing while randomizing
              />
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <button
                  onClick={handleRandomize}
                  className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors duration-200 rounded-lg"
                  disabled={isRandomizing}  // Disable button while randomizing
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
          </main>

          <div className="flex justify-center items-center mb-2">
            <div className="flex items-center text-white text-xs">
              <Lightbulb className="mr-2 flex-shrink-0" size={16} />
              <p>
                Include trigger word <strong>&#39;LuhTyler&#39;</strong> in your prompt for best results.
              </p>
            </div>
          </div>
        </div>

        {/* Full-screen lightbox for the generated image */}
        {isLightboxOpen && generatedImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <div className="relative max-w-3xl w-full p-4">
              <Image 
                src={generatedImage}
                alt="Generated Art" 
                fill  // Replaces layout="fill"
                className="rounded-lg"
              />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-300 transition duration-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
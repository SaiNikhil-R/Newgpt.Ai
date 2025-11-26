import { useState, useCallback } from 'react';
import { Model, UploadedFile } from '../types';
// FIX: getApiKey is removed from geminiService
import { startVideoGeneration, checkVideoGenerationStatus } from '../services/geminiService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const VEO_MESSAGES = [
    "Warming up the virtual cameras...",
    "Choreographing pixels...",
    "Rendering digital starlight...",
    "Teaching polygons to dance...",
    "Assembling the final cut...",
];

export const useVeo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = useCallback(async (
    model: Model, 
    prompt: string,
    file: UploadedFile | null,
    onSuccess: (url: string) => void, 
    onError: (error: string) => void
  ) => {
    setIsLoading(true);
    setStatusMessage('Initializing...');
    setError(null);
    setVideoUrl(null);

    try {
      // FIX: Add API key check for VEO models per guidelines.
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          // Per guidelines, assume success and proceed.
        }
      }
      setStatusMessage('Starting video generation...');
      let operation = await startVideoGeneration(model, prompt, file);
      
      let messageIndex = 0;
      setStatusMessage(VEO_MESSAGES[messageIndex]);
      
      const poll = async () => {
        if (!operation.done) {
          try {
             operation = await checkVideoGenerationStatus(operation);
          } catch(e: any) {
             // FIX: Handle API key error during polling.
             if (e.message?.includes('Requested entity was not found.') && window.aistudio) {
                const keyError = 'Your API key seems invalid. Please select a key from a project with billing enabled. For more info, visit ai.google.dev/gemini-api/docs/billing';
                setError(keyError);
                setIsLoading(false);
                onError(keyError);
                await window.aistudio.openSelectKey(); // Prompt user to select key again.
                return;
             }
             const genericError = "Video generation failed while checking status. Please try again.";
             setError(genericError);
             setIsLoading(false);
             onError(genericError);
             return;
          }

          if (!operation.done) {
             messageIndex = (messageIndex + 1) % VEO_MESSAGES.length;
             setStatusMessage(VEO_MESSAGES[messageIndex]);
             setTimeout(poll, 10000); // Poll every 10 seconds
          } else {
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
              // FIX: Use process.env.API_KEY to fetch video.
              const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
              const videoBlob = await videoResponse.blob();
              const objectUrl = URL.createObjectURL(videoBlob);
              setVideoUrl(objectUrl);
              onSuccess(objectUrl);
            } else {
              throw new Error('Video generation finished but no URL was found.');
            }
            setIsLoading(false);
            setStatusMessage('');
          }
        }
      };

      poll();

    } catch (e: any) {
      console.error(e);
      // FIX: Handle API key error during initial call.
      if (e.message?.includes('Requested entity was not found.') && window.aistudio) {
         const keyError = 'Your API key seems invalid. Please select a key from a project with billing enabled. For more info, visit ai.google.dev/gemini-api/docs/billing';
         setError(keyError);
         onError(keyError);
         setIsLoading(false);
         setStatusMessage('');
         await window.aistudio.openSelectKey(); // Prompt user to select key again.
         return;
      }
      const errorMessage = `Video generation failed for model "${model.name}". Please try again or select a different model.`;
      setError(errorMessage);
      onError(errorMessage);
      setIsLoading(false);
      setStatusMessage('');
    }
  }, []);

  return { isLoading, statusMessage, videoUrl, error, generateVideo };
};

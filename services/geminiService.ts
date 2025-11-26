import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { UploadedFile, Model } from '../types';

// FIX: Per guidelines, API key is from process.env.API_KEY.
// A new instance is created for each call to use the latest key,
// especially important for VEO models where the key can be updated by the user.
const getAi = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const fileToGenerativePart = (file: UploadedFile) => {
  return {
    inlineData: {
      data: file.base64,
      mimeType: file.mimeType,
    },
  };
};

export const generateTextStream = async (
  model: Model,
  prompt: string,
  file: UploadedFile | null,
  onStreamUpdate: (chunk: string) => void,
  onStreamEnd: (sources?: {uri: string, title: string}[]) => void,
) => {
  // FIX: Use synchronous getAi and create a new instance.
  const ai = getAi();
  const contents = [];
  if (file) {
    contents.push(fileToGenerativePart(file));
  }
  contents.push({ text: prompt });

  const stream = await ai.models.generateContentStream({
    model: model.geminiModel,
    contents: { parts: contents },
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  let sources: any[] = [];
  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) {
      onStreamUpdate(text);
    }
    if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      sources = chunk.candidates[0].groundingMetadata.groundingChunks
        .map((c: any) => c.web)
        .filter(Boolean);
    }
  }
  onStreamEnd(sources);
};

export const generateImage = async (model: Model, prompt: string, file: UploadedFile | null): Promise<{ imageUrl: string; text: string }> => {
  // FIX: Use synchronous getAi and create a new instance.
  const ai = getAi();
  const parts: any[] = [];
  if (file) {
    parts.push(fileToGenerativePart(file));
  }
  parts.push({ text: prompt });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model.geminiModel,
    contents: { parts },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    },
  });

  let imageUrl = '';
  let text = '';
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      imageUrl = `data:image/png;base64,${base64EncodeString}`;
    } else if (part.text) {
      text = part.text;
    }
  }
  
  if (!imageUrl) {
     throw new Error('No image was generated. The model may have refused the prompt.');
  }

  return { imageUrl, text };
};

export const startVideoGeneration = async (model: Model, prompt: string, file: UploadedFile | null): Promise<any> => {
  // FIX: Use synchronous getAi and create a new instance.
  const ai = getAi();

  const payload: any = {
    model: model.geminiModel,
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9',
    },
  };

  if (file) {
    payload.image = {
      imageBytes: file.base64,
      mimeType: file.mimeType,
    };
  }

  return ai.models.generateVideos(payload);
};

export const checkVideoGenerationStatus = async (operation: any): Promise<any> => {
  // FIX: Use synchronous getAi and create a new instance.
  const ai = getAi();
  return ai.operations.getVideosOperation({ operation });
};

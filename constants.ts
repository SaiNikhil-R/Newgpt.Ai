import { Model, ModelCategory, ModelProvider } from './types';

export const MODELS: Model[] = [
  // Text & Chat
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: ModelProvider.Google, category: ModelCategory.TEXT, geminiModel: 'gemini-2.5-flash', supportsImage: true },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', provider: ModelProvider.Google, category: ModelCategory.TEXT, geminiModel: 'gemini-3-pro-preview', supportsImage: true },
  { id: 'gpt-5', name: 'ChatGPT 5 (Mock)', provider: ModelProvider.OpenAI, category: ModelCategory.TEXT, geminiModel: 'gemini-3-pro-preview', supportsImage: true },
  { id: 'claude-3', name: 'Claude 3 (Mock)', provider: ModelProvider.Anthropic, category: ModelCategory.TEXT, geminiModel: 'gemini-3-pro-preview', supportsImage: true },

  // Image Generation
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', provider: ModelProvider.Google, category: ModelCategory.IMAGE, geminiModel: 'gemini-2.5-flash-image' },
  
  // Code Generation
  { id: 'gemini-code', name: 'Gemini Code Assistant', provider: ModelProvider.Google, category: ModelCategory.CODE, geminiModel: 'gemini-3-pro-preview' },

  // Document
  { id: 'notebook-llm', name: 'NotebookLM (Mock)', provider: ModelProvider.Google, category: ModelCategory.DOCUMENT, geminiModel: 'gemini-3-pro-preview', supportsImage: true },
  { id: 'pdf-maker', name: 'PDF Content Creator', provider: ModelProvider.Other, category: ModelCategory.DOCUMENT, geminiModel: 'gemini-3-pro-preview' },
];

export const MODEL_CATEGORIES_ORDER = [
  ModelCategory.TEXT,
  ModelCategory.IMAGE,
  ModelCategory.CODE,
  ModelCategory.DOCUMENT,
];
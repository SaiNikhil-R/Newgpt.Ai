export enum ModelProvider {
  Google = 'Google',
  OpenAI = 'OpenAI',
  Anthropic = 'Anthropic',
  Other = 'Other',
}

export enum ModelCategory {
  TEXT = 'Text & Chat',
  IMAGE = 'Image Generation',
  CODE = 'Code Generation',
  DOCUMENT = 'Document & PDF',
}

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  category: ModelCategory;
  geminiModel: string;
  supportsImage?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
  fileInfo?: {
    name: string;
    type: string;
    size: number;
  };
  modelUsed?: Model;
  sources?: { uri: string; title: string }[];
  isStreaming?: boolean;
  isError?: boolean;
}

export interface UploadedFile {
  base64: string;
  mimeType: string;
  name: string;
  size: number;
}

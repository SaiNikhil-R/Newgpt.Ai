import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Model, UploadedFile, ModelCategory } from '../types';
import { MODELS } from '../constants';
import { generateTextStream, generateImage } from '../services/geminiService';
import ModelSelector from './ModelSelector';
import Message from './Message';
import Icon from './Icon';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0]);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModelChange = (modelId: string) => {
    const newModel = MODELS.find(m => m.id === modelId) || MODELS[0];
    setSelectedModel(newModel);
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setUploadedFile(null);
    setInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setUploadedFile({
          base64: base64String,
          mimeType: file.type,
          name: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if ((!input.trim() && !uploadedFile) || isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      fileInfo: uploadedFile ? { name: uploadedFile.name, type: uploadedFile.mimeType, size: uploadedFile.size } : undefined,
    };
    const modelResponseId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const addOrUpdateModelMessage = (update: Partial<ChatMessage>) => {
        setMessages(prev => {
            const existingMsgIndex = prev.findIndex(m => m.id === modelResponseId);
            if (existingMsgIndex !== -1) {
                const updatedMessages = [...prev];
                updatedMessages[existingMsgIndex] = { ...updatedMessages[existingMsgIndex], ...update };
                return updatedMessages;
            } else {
                const newModelMessage: ChatMessage = {
                    id: modelResponseId,
                    role: 'model',
                    text: '',
                    modelUsed: selectedModel,
                    ...update,
                };
                return [...prev, newModelMessage];
            }
        });
    };
    
    try {
        if (selectedModel.category === ModelCategory.IMAGE) {
            addOrUpdateModelMessage({ text: 'Generating image...', isStreaming: true });
            const { imageUrl, text } = await generateImage(selectedModel, input, uploadedFile);
            addOrUpdateModelMessage({ imageUrl, text: text || 'Image generated.', isStreaming: false });
        } else { // Text, Code, Document
            addOrUpdateModelMessage({ isStreaming: true });
            let fullText = '';
            await generateTextStream(
                selectedModel,
                input,
                uploadedFile,
                (chunk) => {
                    fullText += chunk;
                    addOrUpdateModelMessage({ text: fullText });
                },
                (sources) => {
                    addOrUpdateModelMessage({ isStreaming: false, sources: sources });
                }
            );
        }
    } catch (error: any) {
        console.error(error);
        let errorMessage = `An error occurred with model "${selectedModel.name}". Please try again.`;
        if (error.message?.includes('API key not found')) {
            errorMessage = 'API key not found. Please ensure it is configured correctly.'
        } else if (error.toString().includes('PERMISSION_DENIED')) {
          errorMessage = `Permission Denied. Your API key may be invalid or missing permissions. Please ensure the "Generative Language API" is enabled in your Google Cloud project and try again.`;
        }
        addOrUpdateModelMessage({ text: errorMessage, isError: true, isStreaming: false });
    } finally {
        setIsLoading(false);
    }
  }, [input, uploadedFile, selectedModel, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center p-4 border-b border-slate-700 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-dark-text">NewGpt.Ai</h1>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-card border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-sm text-dark-text-secondary hover:text-dark-text"
            aria-label="Start new chat"
          >
            <Icon icon="plus" className="w-5 h-5" />
            New Chat
          </button>
        </div>
        <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
      </header>
      
      <div className="flex-grow overflow-y-auto p-4" id="message-list">
        {messages.map(msg => <Message key={msg.id} message={msg} />)}
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-dark-text-secondary">
                <Icon icon="model" className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-semibold">How can I help you today?</h2>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="flex-shrink-0 p-4">
        <div className="relative bg-dark-card rounded-xl p-2 flex items-center gap-2 border border-slate-700 focus-within:ring-2 focus-within:ring-brand-primary">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Message ${selectedModel.name}...`}
            className="w-full bg-transparent p-2 pr-24 resize-none focus:outline-none text-dark-text placeholder-dark-text-secondary"
            rows={1}
            style={{maxHeight: '200px'}}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !selectedModel.supportsImage}
                aria-label="Upload file"
                title={selectedModel.supportsImage ? "Attach a file" : "The selected model does not support file attachments."}
            >
                <Icon icon="upload" className="w-6 h-6 text-dark-text-secondary" />
            </button>
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!input.trim() && !uploadedFile)}
              className="bg-brand-primary text-white rounded-full p-2 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
              aria-label="Send message"
            >
              <Icon icon="send" className="w-6 h-6" />
            </button>
          </div>
        </div>
        {uploadedFile && (
          <div className="mt-2 text-sm text-dark-text-secondary flex items-center gap-2">
            <span>Attached: {uploadedFile.name}</span>
            <button onClick={() => setUploadedFile(null)}>
              <Icon icon="close" className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default ChatInterface;

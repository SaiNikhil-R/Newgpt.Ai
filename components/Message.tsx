import React from 'react';
import { ChatMessage } from '../types';
import Icon from './Icon';

const BlinkingCursor = () => <span className="inline-block w-2 h-5 bg-brand-primary animate-ping ml-1" />;

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 py-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-brand-primary' : 'bg-dark-card'}`}>
        <Icon icon={isUser ? 'user' : 'model'} className="w-6 h-6 text-white" />
      </div>
      <div className={`w-full max-w-2xl px-5 py-4 rounded-xl ${isUser ? 'bg-brand-primary text-white' : 'bg-dark-card'}`}>
        {message.modelUsed && <p className="text-xs font-semibold mb-2 text-dark-text-secondary">{message.modelUsed.name}</p>}
        
        {message.text && <p className="whitespace-pre-wrap">{message.text}{message.isStreaming && <BlinkingCursor />}</p>}

        {message.fileInfo && (
          <div className="mt-2 text-xs bg-black bg-opacity-20 px-3 py-1 rounded-md">
            Attachment: {message.fileInfo.name}
          </div>
        )}

        {message.imageUrl && <img src={message.imageUrl} alt="Generated content" className="mt-4 rounded-lg" />}
        
        {message.isError && <p className="text-red-400 mt-2">An error occurred. Please try again.</p>}
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-2 border-t border-slate-600">
            <h4 className="text-xs font-bold text-dark-text-secondary mb-2">Sources:</h4>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, index) => (
                <a 
                  key={index} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-md truncate max-w-xs"
                >
                  {source.title || source.uri}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
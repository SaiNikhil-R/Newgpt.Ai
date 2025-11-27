import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="bg-dark-bg text-dark-text h-screen font-sans">
      <ChatInterface />
    </div>
  );
};

export default App;
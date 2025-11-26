import React from 'react';

interface ApiKeyManagerProps {
  onKeySaved: (key: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = () => {
  // This component is no longer used as API keys are handled by environment variables.
  return null;
};

export default ApiKeyManager;

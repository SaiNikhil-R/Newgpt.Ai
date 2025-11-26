import React from 'react';
import Icon from './Icon';

interface TroubleshootingGuideProps {
  onDismiss: () => void;
}

const TroubleshootingGuide: React.FC<TroubleshootingGuideProps> = ({ onDismiss }) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mx-4 mt-4 rounded-r-lg flex items-start gap-4" role="alert">
      <div className="flex-shrink-0">
        <Icon icon="info" className="w-6 h-6 text-yellow-600" />
      </div>
      <div className="flex-grow">
        <p className="font-bold">Having API Key Issues?</p>
        <p className="text-sm">
          If you're seeing a "Permission Denied" error, it usually means there's an issue with your API key setup in Google Cloud.
        </p>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>Ensure the <strong>Generative Language API</strong> is enabled for your project.</li>
          <li>For video models (Veo), make sure your project is linked to a <strong>billing account</strong>.</li>
        </ul>
        <a 
          href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-semibold text-yellow-900 hover:underline mt-3 inline-block"
        >
          Check API Status in Google Cloud &rarr;
        </a>
      </div>
      <button onClick={onDismiss} aria-label="Dismiss" className="p-1 -mt-2 -mr-2 text-yellow-700 hover:text-yellow-900">
        <Icon icon="close" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TroubleshootingGuide;

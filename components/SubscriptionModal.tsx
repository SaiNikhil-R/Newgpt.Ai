import React from 'react';
import Icon from './Icon';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-dark-card rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Icon icon="star" className="w-8 h-8 text-yellow-400" />
            Go Pro
          </h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-white">
            <Icon icon="close" className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-dark-text-secondary mb-8">
          Unlock the most powerful models for professional-quality image and video generation.
        </p>

        <div className="bg-dark-input p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-semibold text-white">Pro Plan</h3>
          <p className="text-brand-primary text-3xl font-bold my-3">$20<span className="text-lg text-dark-text-secondary font-normal">/month</span></p>
          <ul className="space-y-3 text-dark-text my-6">
            <li className="flex items-center gap-3"><Icon icon="image" className="w-5 h-5 text-brand-secondary"/> Highest Quality Image Generation</li>
            <li className="flex items-center gap-3"><Icon icon="video" className="w-5 h-5 text-brand-secondary"/> HD Video Generation (1080p)</li>
            <li className="flex items-center gap-3"><Icon icon="plus" className="w-5 h-5 text-brand-secondary"/> Priority Access & Faster Speeds</li>
          </ul>

          <button 
            onClick={onSubscribe}
            className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors text-lg"
          >
            Upgrade Now
          </button>
        </div>

        <p className="text-center text-xs text-dark-text-secondary mt-6">
          You can cancel anytime. This is a demonstration and no payment will be processed.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionModal;
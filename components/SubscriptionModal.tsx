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
            {/* Fix: Replaced invalid "star" icon with "model", which has a sparkle/star-like appearance. */}
            <Icon icon="model" className="w-8 h-8 text-yellow-400" />
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

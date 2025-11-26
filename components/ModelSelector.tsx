import React from 'react';
import { Model, ModelCategory } from '../types';
import { MODELS, MODEL_CATEGORIES_ORDER } from '../constants';
import Icon from './Icon';

interface ModelSelectorProps {
  selectedModel: Model;
  onModelChange: (modelId: string) => void;
}

const CategoryIcon: React.FC<{ category: ModelCategory }> = ({ category }) => {
  switch (category) {
    case ModelCategory.TEXT: return <Icon icon="text" className="w-4 h-4 mr-2" />;
    case ModelCategory.IMAGE: return <Icon icon="image" className="w-4 h-4 mr-2" />;
    case ModelCategory.CODE: return <Icon icon="code" className="w-4 h-4 mr-2" />;
    case ModelCategory.DOCUMENT: return <Icon icon="doc" className="w-4 h-4 mr-2" />;
    default: return null;
  }
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const groupedModels = MODELS.reduce((acc, model) => {
    (acc[model.category] = acc[model.category] || []).push(model);
    return acc;
  }, {} as Record<ModelCategory, Model[]>);

  return (
    <div className="relative">
      <select
        value={selectedModel.id}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full sm:w-64 bg-dark-input text-dark-text border border-slate-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
      >
        {MODEL_CATEGORIES_ORDER.map(category => (
          <optgroup key={category} label={category} className="bg-slate-700 text-dark-text-secondary">
            {groupedModels[category]?.map(model => (
              <option key={model.id} value={model.id} className="bg-dark-input text-dark-text">
                {model.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-dark-text-secondary">
        <CategoryIcon category={selectedModel.category} />
      </div>
    </div>
  );
};

export default ModelSelector;
import React from 'react';
import { Shield, Lock, Zap } from 'lucide-react';
import { categories } from '../data/categories';
import type { Category } from '../types';

interface CategorySelectorProps {
  selected: Category['id'][];
  onChange: (categories: Category['id'][]) => void;
}

export function CategorySelector({ selected, onChange }: CategorySelectorProps) {
  const toggleCategory = (id: Category['id']) => {
    if (selected.includes(id)) {
      onChange(selected.filter(c => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'shield': return <Shield className="w-6 h-6" aria-hidden="true" />;
      case 'lock': return <Lock className="w-6 h-6" aria-hidden="true" />;
      case 'zap': return <Zap className="w-6 h-6" aria-hidden="true" />;
      default: return null;
    }
  };

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      role="group"
      aria-label="Setting categories"
    >
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => toggleCategory(category.id)}
          className={`p-6 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
            selected.includes(category.id)
              ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
          }`}
          aria-pressed={selected.includes(category.id)}
          aria-label={`${category.title} category: ${category.description}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={selected.includes(category.id) 
              ? 'text-blue-500 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400'
            }>
              {getIcon(category.icon)}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
        </button>
      ))}
    </div>
  );
}
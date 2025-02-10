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
      case 'shield': return <Shield className="w-6 h-6" />;
      case 'lock': return <Lock className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => toggleCategory(category.id)}
          className={`p-6 rounded-lg border-2 transition-colors ${
            selected.includes(category.id)
              ? 'bg-blue-50 border-blue-500'
              : 'bg-white border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={selected.includes(category.id) ? 'text-blue-500' : 'text-gray-600'}>
              {getIcon(category.icon)}
            </div>
            <h3 className="text-lg font-semibold">{category.title}</h3>
          </div>
          <p className="text-gray-600 text-sm">{category.description}</p>
        </button>
      ))}
    </div>
  );
}
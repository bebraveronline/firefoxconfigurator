import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { settings } from '../data/settings';
import type { Setting, Category } from '../types';

interface SettingsPanelProps {
  selectedCategories: Category['id'][];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

export function SettingsPanel({ selectedCategories, values, onChange }: SettingsPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Category['id'][]>(selectedCategories);
  const [showHelp, setShowHelp] = useState<string | null>(null);

  const toggleCategory = (category: Category['id']) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categorySettings = selectedCategories.map(category => ({
    category,
    settings: settings.filter(setting => setting.category.includes(category))
  }));

  const formatValue = (value: number, unit?: string) => {
    return unit ? `${value} ${unit}` : value;
  };

  return (
    <div className="space-y-6" role="region" aria-label="Settings configuration">
      {categorySettings.map(({ category, settings: categorySettings }) => (
        <div key={category} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => toggleCategory(category)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={expandedCategories.includes(category)}
            aria-controls={`settings-${category}`}
          >
            <h3 className="text-lg font-medium capitalize text-gray-900 dark:text-white">
              {category} Settings
            </h3>
            {expandedCategories.includes(category) ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            )}
          </button>
          
          {expandedCategories.includes(category) && (
            <div 
              id={`settings-${category}`}
              className="divide-y divide-gray-100 dark:divide-gray-700"
              role="group"
              aria-label={`${category} settings group`}
            >
              {categorySettings.map(setting => (
                <div key={setting.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white" id={`label-${setting.id}`}>
                          {setting.title}
                        </h4>
                        {setting.helpText && (
                          <button
                            onClick={() => setShowHelp(showHelp === setting.id ? null : setting.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Toggle help text for ${setting.title}`}
                            aria-expanded={showHelp === setting.id}
                          >
                            <HelpCircle className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                      {showHelp === setting.id && setting.helpText && (
                        <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 p-2 rounded" role="tooltip">
                          {setting.helpText}
                        </p>
                      )}
                      <code className="text-xs text-gray-500 dark:text-gray-400 mt-1">{setting.id}</code>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {setting.type === 'boolean' ? (
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            id={setting.id}
                            className="sr-only peer"
                            checked={values[setting.id] ?? setting.default}
                            onChange={e => onChange(setting.id, e.target.checked)}
                            aria-labelledby={`label-${setting.id}`}
                          />
                          <label
                            htmlFor={setting.id}
                            className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 cursor-pointer"
                          >
                            <span className="sr-only">Toggle {setting.title}</span>
                          </label>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1 w-full max-w-xs">
                          <input
                            type="range"
                            id={setting.id}
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                            value={values[setting.id] ?? setting.default}
                            onChange={e => onChange(setting.id, Number(e.target.value))}
                            className="w-full accent-blue-600 dark:accent-blue-500"
                            aria-labelledby={`label-${setting.id}`}
                            aria-valuemin={setting.min}
                            aria-valuemax={setting.max}
                            aria-valuenow={values[setting.id] ?? setting.default}
                            aria-valuetext={`${values[setting.id] ?? setting.default}${setting.unit ? ` ${setting.unit}` : ''}`}
                          />
                          <div className="flex justify-between w-full text-sm text-gray-600 dark:text-gray-400">
                            <span>{formatValue(setting.min!, setting.unit)}</span>
                            <span className="font-medium">
                              {formatValue(values[setting.id] ?? setting.default, setting.unit)}
                            </span>
                            <span>{formatValue(setting.max!, setting.unit)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
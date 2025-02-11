import React, { useState, useEffect } from 'react';
import { Download, Upload, HelpCircle, Moon, Sun } from 'lucide-react';
import { CategorySelector } from './components/CategorySelector';
import { SettingsPanel } from './components/SettingsPanel';
import { Guide } from './components/Guide';
import type { Category, Configuration } from './types';
import { settings as defaultSettings } from './data/settings';

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<Category['id'][]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setDarkMode(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => {
        // Only update if user hasn't set a preference
        if (localStorage.getItem('darkMode') === null) {
          setDarkMode(e.matches);
        }
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Apply dark mode class to html element and save preference
  useEffect(() => {
    if (darkMode === null) return;
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Rest of your existing useEffect for settings...
  React.useEffect(() => {
    const newSettings = { ...settings };
    let hasNewSettings = false;

    selectedCategories.forEach(categoryId => {
      const categorySettings = defaultSettings.filter(setting => 
        setting.category.includes(categoryId)
      );
      
      categorySettings.forEach(setting => {
        if (!(setting.id in newSettings)) {
          newSettings[setting.id] = setting.default;
          hasNewSettings = true;
        }
      });
    });

    Object.keys(settings).forEach(settingId => {
      const setting = defaultSettings.find(s => s.id === settingId);
      if (setting && !setting.category.some(cat => selectedCategories.includes(cat))) {
        delete newSettings[settingId];
        hasNewSettings = true;
      }
    });

    if (hasNewSettings) {
      setSettings(newSettings);
    }
  }, [selectedCategories]);

  const exportConfig = () => {
    const userJsContent = [
      '/*',
      ' * Firefox Configurator - Custom Browser Configuration',
      ' * Generated on: ' + new Date().toISOString(),
      ' */',
      '',
      ...Object.entries(settings).map(([key, value]) => {
        const setting = defaultSettings.find(s => s.id === key);
        const formattedValue = typeof value === 'string' 
          ? `"${value.replace(/["\\]/g, '\\$&')}"` 
          : value;
        return `user_pref("${key}", ${formattedValue}); // ${setting?.title}`;
      })
    ].join('\n');

    const blob = new Blob([userJsContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user.js';
    a.setAttribute('aria-label', 'Download configuration file');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config: Configuration = JSON.parse(e.target?.result as string);
        setSelectedCategories(config.categories);
        setSettings(config.settings);
      } catch (error) {
        console.error('Failed to parse configuration file:', error);
        const alert = document.createElement('div');
        alert.setAttribute('role', 'alert');
        alert.textContent = 'Error importing configuration file. Please check the file format.';
        document.body.appendChild(alert);
        setTimeout(() => document.body.removeChild(alert), 5000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" role="main">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white dark:bg-gray-800 p-4 z-50"
      >
        Skip to main content
      </a>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl" id="main-content">
        <header role="banner">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Firefox Configurator</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Generate a user.js file to customize your browser settings for enhanced privacy, security, and performance
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Inspired by the{' '}
                <a 
                  href="https://github.com/arkenfox/user.js" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Arkenfox user.js project (opens in new tab)"
                >
                  Arkenfox user.js
                </a>
                {' '}project, which provides a comprehensive template for configuring Firefox privacy settings
              </p>
            </div>
            <div className="flex flex-wrap gap-4" role="toolbar" aria-label="Main actions">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:text-gray-200"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Moon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:text-gray-200"
                aria-expanded={showGuide}
              >
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
                <span>Guide</span>
              </button>
              <label 
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus:ring-offset-gray-900 dark:text-gray-200"
                role="button"
                tabIndex={0}
              >
                <Upload className="w-5 h-5" aria-hidden="true" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfig}
                  className="hidden"
                  aria-label="Import configuration file"
                />
              </label>
              <button
                onClick={exportConfig}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Download configuration as user.js file"
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                <span>Download user.js</span>
              </button>
            </div>
          </div>
        </header>

        {showGuide && (
          <div className="mb-8" role="complementary" aria-label="Usage guide">
            <Guide />
          </div>
        )}

        <main>
          <CategorySelector
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />

          {selectedCategories.length > 0 && (
            <div className="space-y-6">
              <SettingsPanel
                selectedCategories={selectedCategories}
                values={settings}
                onChange={(id, value) => setSettings(prev => ({ ...prev, [id]: value }))}
              />
            </div>
          )}
        </main>

        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8" role="contentinfo">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-4">
              <a 
                href="https://github.com/bebraveronline/firefoxconfigurator" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code on GitHub (opens in new tab)"
              >
                View source code on GitHub
              </a>
            </p>
            <div className="max-w-2xl mx-auto space-y-4">
              <p>
                Firefox Configurator is not affiliated with, endorsed by, or supported by Mozilla. 
                Firefox® is a trademark of the Mozilla Foundation in the U.S. and other countries.
              </p>
              <p>
                This software is provided "as is", without warranty of any kind, express or implied. 
                The authors and maintainers take no responsibility for any potential issues or damages 
                that may arise from using this tool. Use at your own risk.
              </p>
              <p>
                This program is free software: you can redistribute it and/or modify it under the terms of the{' '}
                <a 
                  href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GNU General Public License v3
                </a>.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
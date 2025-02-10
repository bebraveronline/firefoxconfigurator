import React, { useState } from 'react';
import { Download, Upload, HelpCircle } from 'lucide-react';
import { CategorySelector } from './components/CategorySelector';
import { SettingsPanel } from './components/SettingsPanel';
import { Guide } from './components/Guide';
import type { Category, Configuration } from './types';

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<Category['id'][]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [showGuide, setShowGuide] = useState(false);

  const exportConfig = () => {
    const config: Configuration = {
      categories: selectedCategories,
      settings,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'firefox-config.json';
    a.click();
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
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Firefox Configurator</h1>
            <p className="text-gray-600 mt-2">Customize your Firefox settings for enhanced privacy, security, and performance</p>
            <p className="text-sm text-gray-500 mt-1">
              Inspired by the <a href="https://github.com/arkenfox/user.js" className="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">Arkenfox user.js</a> project. This extension is not affiliated with, endorsed by, or supported by the Arkenfox project team.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <HelpCircle className="w-5 h-5" />
              Guide
            </button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer">
              <Upload className="w-5 h-5" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
              />
            </label>
            <button
              onClick={exportConfig}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-4">
              Follow these steps to customize your Firefox privacy and security settings:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>
                <span className="font-medium text-gray-900">Select Categories:</span> Choose from Privacy, Security, and Performance categories below. Each category contains specific settings you can customize.
              </li>
              <li>
                <span className="font-medium text-gray-900">Adjust Settings:</span> For each category, you'll see detailed options with descriptions and recommended values. Hover over the help icon (?) next to each setting for additional information.
              </li>
              <li>
                <span className="font-medium text-gray-900">Backup Current Profile:</span> Before applying changes, use the Guide to backup your current Firefox profile. This ensures you can restore your previous settings if needed.
              </li>
              <li>
                <span className="font-medium text-gray-900">Export Configuration:</span> After customizing your settings, click the Export button to save your configuration. You can import this file later to restore these settings.
              </li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Pro Tip:</strong> Start with the Privacy category if you're new to Firefox configuration. The default settings provide a good balance between privacy and usability.
              </p>
            </div>
          </div>
        </div>

        {showGuide && (
          <div className="mb-8">
            <Guide />
          </div>
        )}

        <CategorySelector
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />

        {selectedCategories.length > 0 && (
          <SettingsPanel
            selectedCategories={selectedCategories}
            values={settings}
            onChange={(id, value) => setSettings(prev => ({ ...prev, [id]: value }))}
          />
        )}

        <footer className="mt-16 border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <a 
                href="https://github.com/bebraveronline/firefoxconfigurator" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View source code on GitHub
              </a>
            </p>
            <p className="max-w-2xl mx-auto">
              This software is provided "as is", without warranty of any kind, express or implied. 
              The authors and maintainers take no responsibility for any potential issues or damages 
              that may arise from using this extension. Use at your own risk.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
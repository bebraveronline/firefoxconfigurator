import React, { useState, useCallback } from 'react';
import { Download, Upload, HelpCircle, RefreshCw } from 'lucide-react';
import { CategorySelector } from './components/CategorySelector';
import { SettingsPanel } from './components/SettingsPanel';
import { Guide } from './components/Guide';
import type { Category, Configuration } from './types';

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<Category['id'][]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [applyStatus, setApplyStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const startCountdown = useCallback(() => {
    setCountdown(5); // Changed from 3 to 5 seconds
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsApplying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const applySettings = async () => {
    try {
      setIsApplying(true);
      setError('');
      startCountdown();
      
      const response = await browser.runtime.sendMessage({ 
        type: 'APPLY_SETTINGS',
        settings
      });
      
      if (response.success) {
        setApplyStatus(`
          The user.js file will be downloaded shortly.
          
          After downloading:
          1. Move the file to your Firefox profile directory:
             • Windows: %APPDATA%\\Mozilla\\Firefox\\Profiles\\[profile-name]
             • macOS: ~/Library/Application Support/Firefox/Profiles/[profile-name]
             • Linux: ~/.mozilla/firefox/[profile-name]
             
          2. Restart Firefox for the changes to take effect
          
          Tip: To find your profile directory, open Firefox and go to about:support
        `);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setError((error as Error).message);
      setApplyStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Firefox Configurator</h1>
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
          <div className="space-y-6">
            <SettingsPanel
              selectedCategories={selectedCategories}
              values={settings}
              onChange={(id, value) => setSettings(prev => ({ ...prev, [id]: value }))}
            />
            
            <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border border-gray-200">
              {applyStatus && (
                <div className="text-center p-4 bg-blue-50 text-blue-700 rounded-lg max-w-2xl whitespace-pre-line">
                  {applyStatus}
                </div>
              )}
              
              {error && (
                <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg max-w-2xl">
                  Error: {error}
                </div>
              )}

              <button
                onClick={applySettings}
                disabled={isApplying}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                  isApplying 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                <RefreshCw className={`w-5 h-5 ${isApplying ? 'animate-spin' : ''}`} />
                {isApplying ? `Please wait (${countdown})` : 'Apply Settings'}
              </button>
            </div>
          </div>
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
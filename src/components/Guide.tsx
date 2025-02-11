import React from 'react';
import { FileDown, Shield, RefreshCw } from 'lucide-react';

export function Guide() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Implementation Guide</h2>
      
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <FileDown className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium mb-2">1. Configure Settings</h3>
            <p className="text-gray-600">
              Select the categories and adjust the settings according to your preferences.
              Each setting includes a description and recommended values.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Shield className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium mb-2">2. Apply Your Configuration</h3>
            <p className="text-gray-600">
              After selecting your preferred settings, click the Apply button. This will:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600">
              <li>Download a file named <code>user.js</code></li>
              <li>
                You'll need to move this file to your browser profile directory:
                <ul className="ml-6 mt-1 list-disc">
                  <li>Windows: <code>%APPDATA%\Mozilla\Firefox\Profiles\[profile-name]</code></li>
                  <li>macOS: <code>~/Library/Application Support/Firefox/Profiles/[profile-name]</code></li>
                  <li>Linux: <code>~/.mozilla/firefox/[profile-name]</code></li>
                </ul>
              </li>
              <li>Restart your browser for the changes to take effect</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
              <strong>Tip:</strong> To find your profile directory, open your browser and go to <code>about:support</code>. 
              Look for "Profile Directory" and click "Open Directory".
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1">
            <RefreshCw className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium mb-2">3. Restart Browser</h3>
            <p className="text-gray-600">
              After placing the user.js file in your profile directory, restart your browser for the changes to take effect.
              Your new settings will be applied when the browser starts up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
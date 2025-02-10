import React, { useState } from 'react';
import { FileDown, Shield, RefreshCw, Save } from 'lucide-react';

export function Guide() {
  const [backupStatus, setBackupStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const backupProfile = async () => {
    try {
      setBackupStatus('Backing up...');
      setError('');
      
      const response = await browser.runtime.sendMessage({ type: 'BACKUP_PROFILE' });
      if (response.success) {
        setBackupStatus('Backup successful!');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setError((error as Error).message);
      setBackupStatus('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Implementation Guide</h2>
      
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <FileDown className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">1. Backup Your Current Profile</h3>
            <p className="text-gray-600 mb-3">
              It's important to backup your current Firefox profile before making changes.
              Click the button below to create a backup of your current profile settings.
            </p>
            <button
              onClick={backupProfile}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              <Save className="w-4 h-4" />
              Backup Current Profile
            </button>
            {backupStatus && (
              <p className="mt-2 text-sm text-green-600">{backupStatus}</p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">Error: {error}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Shield className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium mb-2">2. Configure Settings</h3>
            <p className="text-gray-600">
              Select the categories and adjust the settings according to your preferences.
              Each setting includes a description and recommended values.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1">
            <RefreshCw className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium mb-2">3. Apply Your Configuration</h3>
            <p className="text-gray-600">
              After selecting your preferred settings, click the Apply button below to
              save your settings. You'll need to restart Firefox for some changes to take effect.
            </p>
            <button
              onClick={() => browser.runtime.sendMessage({ 
                type: 'APPLY_SETTINGS',
                settings: {} // TODO: Add selected settings
              })}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
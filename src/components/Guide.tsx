import React from 'react';
import { FileDown, Shield, RefreshCw, Save } from 'lucide-react';

export function Guide() {
  const backupProfile = async () => {
    try {
      const response = await browser.runtime.sendMessage({ type: 'BACKUP_PROFILE' });
      if (response.success) {
        // Handle successful backup
        console.log('Profile backed up successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Failed to backup profile:', error);
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
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Shield className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium mb-2">2. Install arkenfox</h3>
            <p className="text-gray-600">
              The extension will automatically download and install the latest arkenfox user.js
              and related files to your Firefox profile directory.
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
              Click the Apply button to save your settings. The extension will automatically
              create the user-overrides.js file and run the updater script.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
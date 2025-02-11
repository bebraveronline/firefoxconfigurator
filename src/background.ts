// Handle settings application and tab opening
browser.runtime.onMessage.addListener(async (message: { type: string; settings?: any }) => {
  // Validate message structure
  if (!message || typeof message !== 'object' || !message.type) {
    return { success: false, error: 'Invalid message format' };
  }

  if (message.type === 'BACKUP_PROFILE') {
    try {
      // Get current settings from storage with timeout
      const result = await Promise.race([
        browser.storage.local.get(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Storage timeout')), 5000)
        )
      ]);
      return { success: true, data: result };
    } catch (error) {
      console.error('Backup error:', error);
      return { success: false, error: (error as Error).message };
    }
  }
  
  if (message.type === 'APPLY_SETTINGS') {
    try {
      const { settings } = message;
      
      // Validate settings object
      if (!settings || typeof settings !== 'object') {
        throw new Error('Invalid settings format');
      }

      // Import settings data
      const settingsData = await import('./data/settings.js');
      const settingsMap = new Map(settingsData.settings.map(s => [s.id, s]));

      // Create user.js content with detailed comments
      const userJsContent = [
        '/*',
        ' * user.js Generator - Custom Browser Configuration',
        ' * Generated on: ' + new Date().toISOString(),
        ' * ',
        ' * This file contains browser preferences to enhance:',
        ' * - Privacy: Limit tracking and data collection',
        ' * - Security: Protect against threats and vulnerabilities',
        ' * - Performance: Optimize browser speed and resource usage',
        ' *',
        ' * Each setting includes a detailed explanation of its purpose.',
        ' * Review and modify these settings based on your needs.',
        ' *',
        ' * IMPORTANT: Some settings may affect website functionality.',
        ' * If you experience issues, you can:',
        ' * 1. Comment out specific settings using // at the start of the line',
        ' * 2. Remove settings entirely',
        ' * 3. Modify values to be less restrictive',
        ' *',
        ' * After any changes, restart your browser for them to take effect.',
        ' */',
        '',
        ...Object.entries(settings).map(([key, value]) => {
          const setting = settingsMap.get(key);
          const lines = [
            '',
            '/* ' + '-'.repeat(76) + ' */',
            `/* ${setting?.title || key}`,
            ' *',
            ` * ${setting?.description || 'No description available'}`,
          ];

          if (setting?.helpText) {
            lines.push(' *', ' * Note:', ` * ${setting.helpText}`);
          }

          if (setting?.type === 'number' && setting.min !== undefined && setting.max !== undefined) {
            lines.push(' *', ' * Valid range:');
            if (setting.unit) {
              lines.push(` * - ${setting.min} to ${setting.max} ${setting.unit}`);
            } else {
              lines.push(` * - ${setting.min} to ${setting.max}`);
            }
          }

          lines.push(' *', ` * Default value: ${setting?.default}`, ' */');

          const formattedValue = typeof value === 'string' 
            ? `"${value.replace(/["\\]/g, '\\$&')}"` 
            : value;

          lines.push(`user_pref("${key}", ${formattedValue});`, '');
          return lines.join('\n');
        })
      ].join('\n');

      // Create a blob and trigger download
      const blob = new Blob([userJsContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      try {
        await browser.downloads.download({
          url: url,
          filename: 'user.js',
          saveAs: true
        });

        return { success: true };
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Settings application error:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  return { success: false, error: 'Unknown message type' };
});

// Open extension in a new tab when the toolbar icon is clicked
browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({
    url: 'popup.html'
  });
});
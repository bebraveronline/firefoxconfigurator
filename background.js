// Handle profile operations
browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'BACKUP_PROFILE') {
    try {
      // Get the profile directory
      const profileDir = await browser.runtime.sendNativeMessage('firefox', {
        cmd: 'GET_PROFILE_DIR'
      });
      
      // Create backup
      return { success: true, data: profileDir };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  if (message.type === 'APPLY_SETTINGS') {
    try {
      const { settings } = message;
      // Apply settings to user.js
      await browser.runtime.sendNativeMessage('firefox', {
        cmd: 'WRITE_USER_JS',
        settings
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});
// Mock implementation for development environment
const mockStorage: Record<string, any> = {};

// Check if we're in a browser extension context
const isBrowserExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

// Use the browser API if available, otherwise create a mock
const browserAPI = isBrowserExtension 
  ? (typeof browser !== 'undefined' ? browser : chrome) 
  : {
    storage: {
      local: {
        get: async () => ({ ...mockStorage }),
        set: async (items: Record<string, any>) => {
          Object.assign(mockStorage, items);
        },
      },
    },
    runtime: {
      sendMessage: async (message: any) => {
        if (message.type === 'BACKUP_PROFILE') {
          return { success: true, data: mockStorage };
        }
        if (message.type === 'APPLY_SETTINGS') {
          const { settings } = message;
          
          // Create user.js content
          const userJsContent = [
            '// user.js Generator - Generated Settings',
            `// Generated on: ${new Date().toISOString()}`,
            '',
            ...Object.entries(settings).map(([key, value]) => {
              const formattedValue = typeof value === 'string' 
                ? `"${value.replace(/["\\]/g, '\\$&')}"` 
                : value;
              return `user_pref("${key}", ${formattedValue});`;
            })
          ].join('\n');

          // Create a blob and trigger download
          const blob = new Blob([userJsContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'user.js';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 100);

          Object.assign(mockStorage, settings);
          return { success: true };
        }
        return { success: false, error: 'Unknown message type' };
      },
    },
    downloads: {
      download: async ({ url, filename }: { url: string; filename: string }) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
        return 1;
      },
    },
    tabs: {
      create: async () => ({}),
    },
    browserAction: {
      onClicked: {
        addListener: () => {},
      },
    },
  };

// Export the API
export const browser = browserAPI;

// Make it globally available
if (!isBrowserExtension) {
  (window as any).browser = browserAPI;
}
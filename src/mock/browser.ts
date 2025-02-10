// Mock implementation for development environment
const mockStorage: Record<string, any> = {};

export const mockBrowser = {
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
        Object.assign(mockStorage, settings);
        return { success: true };
      }
      return { success: false, error: 'Unknown message type' };
    },
  },
  downloads: {
    download: async ({ url, filename }: { url: string; filename: string }) => {
      // In development, we'll just trigger a normal download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      return 1; // Mock download id
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

// Add the mock browser to window in development
if (import.meta.env.DEV) {
  (window as any).browser = mockBrowser;
}
/// <reference types="vite/client" />

interface Browser {
  storage: {
    local: {
      get: () => Promise<Record<string, any>>;
      set: (items: Record<string, any>) => Promise<void>;
    };
  };
  runtime: {
    sendMessage: (message: any) => Promise<any>;
  };
  downloads: {
    download: (options: { url: string; filename: string; saveAs?: boolean }) => Promise<number>;
  };
}

declare const browser: Browser;
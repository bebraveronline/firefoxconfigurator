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
  tabs: {
    create: (options: { url: string }) => Promise<any>;
  };
  browserAction: {
    onClicked: {
      addListener: (callback: () => void) => void;
    };
  };
}

declare const browser: Browser;
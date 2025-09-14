import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.ladish.finetrack',
  appName: 'FineTrack',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  server: {
    // Allow cleartext traffic for development
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;

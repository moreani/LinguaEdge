import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.linguaedge.app',
  appName: 'LinguaEdge',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

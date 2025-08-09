import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'PflanzenABC',
  webDir: 'www',
  plugins: {
    SafeArea: {
      enabled: true,
      customColorsForSystemBars: true,
      statusBarColor: '#000000',
      statusBarContent: 'light',
      navigationBarColor: '#000000',
      navigationBarContent: 'light',
      offset: 0,
    },
  },
};

export default config;

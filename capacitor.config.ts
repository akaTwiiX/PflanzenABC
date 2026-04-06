/// <reference types="@capacitor-community/safe-area" />
import { SystemBarsStyle } from '@capacitor-community/safe-area';
import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'de.pflanzenabc.app',
  appName: 'PflanzenABC',
  webDir: 'www',
  plugins: {
    SafeArea: {
      statusBarStyle: SystemBarsStyle.Dark,
      navigationBarStyle: SystemBarsStyle.Dark,
    },
    Keyboard: {
      resize: KeyboardResize.Ionic,
      resizeOnFullScreen: false,
    },
  },
};

export default config;

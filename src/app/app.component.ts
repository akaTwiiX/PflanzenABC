import { BackupStateService } from '@/services/backup-state.service';
import { IncrementalBackupService } from '@/services/incremental-backup.service';
import { Component } from '@angular/core';
import { App, AppState } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.setSafeArea();
      this.clearCacheOnStartup();
    });
  }

  setSafeArea(){
    SafeArea.getSafeAreaInsets().then((data) => {
        // document.documentElement.classList.toggle('ion-palette-dark', true);
        const { insets } = data;
        document.body.style.setProperty('--ion-safe-area-top', `${insets.top}px`);
        document.body.style.setProperty('--ion-safe-area-right', `${insets.right}px`);
        document.body.style.setProperty('--ion-safe-area-bottom', `${insets.bottom}px`);
        document.body.style.setProperty('--ion-safe-area-left', `${insets.left}px`);
      });
  }

  private async clearCacheOnStartup() {
    try {
      await Filesystem.rmdir({
        directory: Directory.Cache,
        path: '',
        recursive: true,
      });
      console.log('🧹 Cache cleared');
    } catch (err) {
      console.warn('⚠️ Cache cleared failed:', err);
    }
  }

}

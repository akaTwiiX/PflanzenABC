import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SafeArea, SystemBarsStyle } from '@capacitor-community/safe-area';
import { App } from '@capacitor/app';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import {
  AlertController,
  IonApp,
  IonRouterOutlet,
  ModalController,
  NavController,
} from '@ionic/angular/standalone';
import { onAuthStateChanged } from 'firebase/auth';

import { register } from 'swiper/element/bundle';
import { AuthService } from './shared/services/auth.service';
import { BackupStateService } from './shared/services/backup-state.service';
import { auth } from './shared/services/firebase';
import { IncrementalBackupService } from './shared/services/incremental-backup.service';
import { UpdaterService } from './shared/services/updater.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private platform = inject(Platform);
  private updater = inject(UpdaterService);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);
  private authService = inject(AuthService);
  private router = inject(Router);
  private navCtrl = inject(NavController);

  constructor() {
    // this.setupScrollToTop();
    this.platform.ready().then(async () => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.navCtrl.back();
      });

      onAuthStateChanged(auth, (user) => {
        this.authService.currentUser.set(user);
        if (user) {
          if (!user.emailVerified) {
            console.warn('⚠️ Email not verified');
            return;
          }

          console.log('✅ User logged in:', user.email);
          IncrementalBackupService.restoreBackup();
          this.setupBackupListeners();
        } else {
          console.log('🚪 User logged out');
        }
      });

      if (this.platform.is('capacitor')) {
        this.clearCacheOnStartup();
        this.updater.checkForUpdates();
        await SafeArea.setSystemBarsStyle({
          style: SystemBarsStyle.Light,
        });
      }
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

  private async setupBackupListeners() {
    App.addListener('appStateChange', async () => {
      console.log('📴 Start backup...');
      await BackupStateService.performBackupIfNeeded();
    });
  }

  private setupScrollToTop() {
    let lastPath = '';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentPath = event.urlAfterRedirects.split('?')[0];

        if (currentPath !== lastPath) {
          lastPath = currentPath;

          // Small delay to ensure the content is rendered and ready
          setTimeout(() => {
            const contents = document.querySelectorAll('ion-content');
            contents.forEach((content: any) => {
              if (content.scrollToTop) {
                content.scrollToTop(0);
              }
            });
          }, 100);
        }
      }
    });
  }
}

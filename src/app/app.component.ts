import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import {
  AlertController,
  IonApp,
  IonRouterOutlet,
  ModalController,
  NavController,
} from '@ionic/angular/standalone';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { onAuthStateChanged } from 'firebase/auth';

import { register } from 'swiper/element/bundle';
import { DownloadModalComponent } from './components/download-modal/download-modal.component';
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
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.navCtrl.back();
      });
      this.setSafeArea();

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

      if (Capacitor.getPlatform() !== 'web') {
        this.clearCacheOnStartup();
        this.checkForUpdates();
      }
    });
  }

  setSafeArea() {
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

  async checkForUpdates() {
    try {
      const update = await this.updater.checkForUpdate();
      if (update.available) {
        const alert = await this.alertCtrl.create({
          header: 'Update verfügbar',
          message: `Version ${update.version} ist verfügbar.`,
          buttons: [
            { text: 'Später' },
            {
              text: 'Installieren',
              handler: () => this.showDownloadModal(update.url),
            },
          ],
        });
        await alert.present();
      }
    } catch (err) {
      console.error('Update-Check failed', err);
    }
  }

  async showDownloadModal(url: string) {
    const modal = await this.modalCtrl.create({
      component: DownloadModalComponent,
      componentProps: { url },
      backdropDismiss: false,
    });
    await modal.present();
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

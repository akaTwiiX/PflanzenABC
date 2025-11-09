import { BackupStateService } from '@/services/backup-state.service';
import { IncrementalBackupService } from '@/services/incremental-backup.service';
import { Component } from '@angular/core';
import { App, AppState } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { IonApp, IonRouterOutlet, AlertController, ModalController } from '@ionic/angular/standalone';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { register } from 'swiper/element/bundle';
import { DownloadModalComponent } from './components/download-modal/download-modal.component';
import { UpdaterService } from '@/services/updater.service';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '@/services/auth.service';
import { auth } from '@/services/firebase';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private updater: UpdaterService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) {
    this.platform.ready().then(() => {
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
      };
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
    App.addListener('appStateChange', async (state: AppState) => {
      console.log('📴 Start backup...');
      await BackupStateService.performBackupIfNeeded();
    });
  }

}

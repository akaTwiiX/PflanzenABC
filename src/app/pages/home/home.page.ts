import { Component, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, ModalController, AlertController, MenuController, IonButtons, IonButton, IonIcon, IonMenuButton, IonMenu, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { MainContentComponent } from './main-content/main-content.component';
import { UpdaterService } from '@/services/updater.service';
import { DownloadModalComponent } from 'src/app/components/download-modal/download-modal.component';
import { Capacitor } from '@capacitor/core';
import { AuthenticationModalComponent } from 'src/app/components/authentication-modal/authentication-modal.component';
import { AuthService } from '@/services/auth.service';
import { IncrementalBackupService } from '@/services/incremental-backup.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, MainContentComponent, IonButtons, IonIcon, IonMenuButton, IonMenu, IonList, IonItem, IonLabel],
})
export class HomePage {
  @ViewChild('mainContent') mainContent!: MainContentComponent;
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private updater: UpdaterService,
    public authService: AuthService
  ) { }

  get backupAvailable() {
    return IncrementalBackupService.backupAvailable();
  }

  ionViewWillEnter() {
    this.mainContent.enterPage();
    if (Capacitor.getPlatform() !== 'web') {
      this.checkForUpdates();
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
      console.log('Update-Check failed', err);
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

  async openAuthModal() {
    await this.menuCtrl.close();
    const modal = await this.modalCtrl.create({
      component: AuthenticationModalComponent,
    });
    await modal.present();
  }

  async logout() {
    await this.authService.logout();
    IncrementalBackupService.backupAvailable.set(false);
    await this.menuCtrl.close();
  }
}

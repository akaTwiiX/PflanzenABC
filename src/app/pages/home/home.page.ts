import { Component, ViewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  ModalController,
  AlertController
} from '@ionic/angular/standalone';
import { MainContentComponent } from './main-content/main-content.component';
import { UpdaterService } from '@/services/updater.service';
import { DownloadModalComponent } from 'src/app/components/download-modal/download-modal.component';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, MainContentComponent],
})
export class HomePage {
  @ViewChild('mainContent') mainContent!: MainContentComponent;
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private updater: UpdaterService) {}

  ionViewWillEnter(){
    this.mainContent.enterPage();
    if(Capacitor.getPlatform() !== 'web'){
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
}

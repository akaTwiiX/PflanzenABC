import { DecimalPipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { UpdaterService } from '../../shared/services/updater.service';

interface DownloadAlertProps {
  header: string;
  message: string;
  buttons: string[];
}

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
  imports: [IonProgressBar, IonButton, IonContent, IonHeader, IonToolbar, IonTitle, DecimalPipe],
})
export class DownloadModalComponent {
  private updater = inject(UpdaterService);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);

  @Input() url!: string;
  progress = signal(0);
  downloading = signal(false);

  async ionViewDidEnter() {
    this.downloading.set(true);
    try {
      await this.updater.downloadAndInstall(this.url, (p) => {
        this.progress.set(p / 100);
      });

      if (this.updater.cancelled())
        return;

      await this.showAlert({
        header: 'Update installiert',
        message: 'Das Update wurde erfolgreich installiert.',
        buttons: ['OK'],
      });
    } catch (e) {
      if (this.updater.cancelled())
        return;

      console.error('Download/Install failed:', e);

      await this.showAlert({
        header: 'Fehler beim Update',
        message: 'Das Update konnte nicht installiert werden.',
        buttons: ['OK'],
      });
    } finally {
      this.updater.cancelled.set(false);
      this.downloading.set(false);
      await this.modalCtrl.dismiss();
    }
  }

  async showAlert(props: DownloadAlertProps) {
    const alert = await this.alertCtrl.create(props);
    await alert.present();
  }

  async cancel() {
    await this.updater.cancel();
    await this.modalCtrl.dismiss();
    await this.showAlert({
      header: 'Update abgebrochen',
      message: 'Der Download wurde abgebrochen.',
      buttons: ['OK'],
    });
  }
}

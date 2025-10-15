import { UpdaterService } from '@/services/updater.service';
import { Component, Input } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IonProgressBar, IonButton, IonContent, IonHeader, IonToolbar, IonTitle, ModalController, AlertController} from "@ionic/angular/standalone";

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
  imports: [IonProgressBar, IonButton, IonContent, IonHeader, IonToolbar, IonTitle],
})
export class DownloadModalComponent {
  @Input() url!: string;
  progress = 0;
  downloading = false;

  constructor(private updater: UpdaterService, private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  async ionViewDidEnter() {
    this.downloading = true;
    try {
      await this.updater.downloadAndInstall(this.url, (p) => (this.progress = p));
      await this.modalCtrl.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Download abgeschlossen',
        message: 'Das Update wurde erfolgreich gedownloadet. Bitte folge den Anweisungen des Installationsprogramms.',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (e) {
      this.modalCtrl.dismiss();
      console.error('ERROR: ',e);
      const alert = await this.alertCtrl.create({
        header: 'Fehler beim Update',
        message: 'Das Update konnte nicht installiert werden.',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      this.downloading = false;
    }
  }

  async cancel() {
    await this.modalCtrl.dismiss();
  }
}

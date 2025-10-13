import { UpdaterService } from '@/services/updater.service';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonProgressBar, IonButton, IonContent, IonHeader, IonToolbar, IonTitle} from "@ionic/angular/standalone";

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
  imports: [IonProgressBar, IonButton, IonContent, IonHeader, IonToolbar, IonTitle],
})
export class DownloadModalComponent {
  @Input() url!: string;
  progress = 0;
  downloading = false;

  constructor(private updater: UpdaterService, private modalCtrl: ModalController) { }

  async ionViewDidEnter() {
    this.downloading = true;
    try {
      await this.updater.downloadAndInstall(this.url, (p) => (this.progress = p));
      await this.modalCtrl.dismiss();
    } catch (e) {
      console.error(e);
      await this.modalCtrl.dismiss();
    } finally {
      this.downloading = false;
    }
  }

  async cancel() {
    this.updater.cancelDownload();
    await this.modalCtrl.dismiss();
  }
}

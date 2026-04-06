import { inject, Injectable, signal } from '@angular/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { App } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';
import { FileTransfer } from '@capacitor/file-transfer';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { AlertController, ModalController } from '@ionic/angular/standalone';
import { DownloadModalComponent } from '../../components/download-modal/download-modal.component';

@Injectable({ providedIn: 'root' })
export class UpdaterService {
  private readonly VERSION_PREFIX_REGEX = /^v/;
  githubRepo = 'akatwiix/PflanzenABC';
  alertCtrl = inject(AlertController);
  modalCtrl = inject(ModalController);

  private listener: PluginListenerHandle | null = null;
  cancelled = signal(false);

  async checkForUpdate() {
    const info = await App.getInfo();

    if (info.version.includes('DEBUG')) {
      console.log('🛠️ Debug build – skipping update check');
      return { available: false };
    }

    const res = await CapacitorHttp.get({
      url: `https://api.github.com/repos/${this.githubRepo}/releases/latest`,
    });

    const release = res.data;

    if (release.prerelease || release.draft)
      return { available: false };

    const latest = res.data.tag_name?.replace(this.VERSION_PREFIX_REGEX, '');
    const asset = res.data.assets?.find((a: any) => a.name.endsWith('.apk'));

    if (!latest || !asset)
      return { available: false };

    const isNewer = this.compareSemver(latest, info.version) > 0;

    if (isNewer) {
      return { available: true, version: latest, url: asset.browser_download_url };
    }
    return { available: false };
  }

  private compareSemver(a: string, b: string): number {
    const parse = (v: string) => v.split('.').map(Number);
    const [aMajor, aMinor, aPatch] = parse(a);
    const [bMajor, bMinor, bPatch] = parse(b);

    if (Number.isNaN(aMajor) || Number.isNaN(bMajor))
      return 0;
    if (aMajor !== bMajor)
      return aMajor - bMajor;
    if (aMinor !== bMinor)
      return aMinor - bMinor;
    return aPatch - bPatch;
  }

  async checkForUpdates() {
    try {
      const update = await this.checkForUpdate();
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

  async downloadAndInstall(apkUrl: string, onProgress: (percent: number) => void) {
    const fileName = 'update.apk';

    await this.cleanup();

    this.listener = await FileTransfer.addListener('progress', (progress) => {
      if (!progress.contentLength)
        return;

      if (this.cancelled())
        throw new Error('Download cancelled');

      const percent = Math.round((progress.bytes / progress.contentLength) * 100);
      onProgress(Math.min(percent, 100));
    });

    try {
      const fileInfo = await Filesystem.getUri({
        directory: Directory.Cache,
        path: fileName,
      });

      const result = await FileTransfer.downloadFile({
        url: apkUrl,
        path: fileInfo.uri,
        progress: true,
      });

      if (this.cancelled())
        return;

      if (!result.path)
        throw new Error('Download failed: No file path returned');

      await FileOpener.open({
        filePath: result.path,
        contentType: 'application/vnd.android.package-archive',
      });
    } catch (err) {
      console.error('❌ Download/Install failed:', err);
      throw err;
    } finally {
      await this.cleanup();
      // this.cancelled.set(false);
    }
  }

  async cleanup() {
    await this.listener?.remove();
    this.listener = null;
  }

  async cancel() {
    this.cancelled.set(true);
    await this.cleanup();
  }
}

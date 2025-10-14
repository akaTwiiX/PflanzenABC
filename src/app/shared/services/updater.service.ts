import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileTransfer, DownloadFileOptions } from '@capacitor/file-transfer';
import { FileOpener } from '@capacitor-community/file-opener';
import { CapacitorHttp } from '@capacitor/core';


@Injectable({ providedIn: 'root' })
export class UpdaterService {
  githubRepo = 'akatwiix/PflanzenABC';
  private abortController?: AbortController;

  async checkForUpdate() {
    const info = await App.getInfo();

    const res = await CapacitorHttp.get({
      url: `https://api.github.com/repos/${this.githubRepo}/releases/latest`,
    });

    const latest = res.data.tag_name?.replace(/^v/, '');
    const asset = res.data.assets?.find((a: any) => a.name.endsWith('.apk'));

    if (!asset) return { available: false };

    if (latest !== info.version) {
      return { available: true, version: latest, url: asset.browser_download_url };
    }
    return { available: false };
  }

  async downloadAndInstall(apkUrl: string, onProgress?: (percent: number) => void) {
    const fileInfo = await Filesystem.getUri({
      directory: Directory.Cache,
      path: 'update.apk',
    });

    const listener = await FileTransfer.addListener('progress', (progress) => {
      if (onProgress && progress.contentLength) {
        const percent = Math.round((progress.bytes / progress.contentLength) * 100);
        onProgress(percent);
      }
    });

    try {
      const result = await FileTransfer.downloadFile({
        url: apkUrl,
        path: fileInfo.uri,
      } as DownloadFileOptions);

      if (!result.path) {
        throw new Error('Downloaded file path is undefined.');
      }

      await FileOpener.open({
        filePath: result.path,
        contentType: 'application/vnd.android.package-archive',
      });

    } catch (err) {
      console.error('❌ Download failed:', err);
      FileTransfer.removeAllListeners();
      throw err;
    } finally {
      listener.remove();
    }
  }

  cancelDownload() {
    this.abortController?.abort();
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = (reader.result as string).split(',')[1];
        resolve(result);
      };
      reader.readAsDataURL(blob);
    });
  }
}

import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileTransfer } from '@capacitor/file-transfer';
import { FileOpener } from '@capacitor-community/file-opener';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class UpdaterService {
  githubRepo = 'akatwiix/PflanzenABC';

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
    const fileName = 'update.apk';

    const fileInfo = await Filesystem.getUri({
      directory: Directory.Cache,
      path: fileName,
    });

    const listener = await FileTransfer.addListener('progress', (progress) => {
      if (onProgress && progress.contentLength) {
        const percent = Math.round((progress.bytes / progress.contentLength) * 100);
        onProgress(percent);
      }
    });

    try {
      console.log('⬇️ Download started:', fileInfo.uri);

      const result = await FileTransfer.downloadFile({
        url: apkUrl,
        path: fileInfo.uri,
        progress: true,
      });

      if (!result.path) {
        throw new Error('Download failed: No file path returned');
      }

      console.log('✅ Download complete:', result.path);

      await FileOpener.open({
        filePath: result.path,
        contentType: 'application/vnd.android.package-archive',
      });

    } catch (err) {
      console.error('❌ Download/Install failed:', err);
      throw err;
    } finally {
      listener.remove();
    }
  }
}

import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';
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
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    const response = await fetch(apkUrl, { signal });
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Download Reader is not available.');

    const contentLength = +response.headers.get('Content-Length')!;
    let received = 0;
    let chunks: Uint8Array[] = [];

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          const percent = Math.round((received / contentLength) * 100);
          onProgress?.(percent);
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('📴 Download canceled');
        await Filesystem.deleteFile({ path: 'update.apk', directory: Directory.Cache }).catch(() => { });
        return;
      }
      throw err;
    }

    const blob = new Blob(chunks as BlobPart[]);
    const base64 = await this.blobToBase64(blob);

    await Filesystem.writeFile({
      path: 'update.apk',
      data: base64,
      directory: Directory.Cache,
    });

    const uri = await Filesystem.getUri({
      directory: Directory.Cache,
      path: 'update.apk',
    });

    await FileOpener.open({
      filePath: uri.uri,
      contentType: 'application/vnd.android.package-archive',
    });
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

import { Injectable } from '@angular/core';
import { IncrementalBackupService } from './incremental-backup.service';

@Injectable({
  providedIn: 'root'
})
export class BackupStateService {
  private static backupPending = false;
  private static lastBackup = 0;

  static markChanged() {
    this.backupPending = true;
  }

  static needsBackup(): boolean {
    const now = Date.now();
    return this.backupPending || (now - this.lastBackup > 6 * 60 * 60 * 1000);
  }

  static async performBackupIfNeeded() {
    if (!this.needsBackup()) return;

    console.log('💾 Performing scheduled backup...');
    await IncrementalBackupService.createEncryptedBackup();
    this.backupPending = false;
    this.lastBackup = Date.now();
  }
}

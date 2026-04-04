import { Injectable } from '@angular/core';
import { IncrementalBackupService } from '@/shared/services/incremental-backup.service';

@Injectable({
  providedIn: 'root',
})
export class BackupStateService {
  private static backupPending = false;

  static markChanged() {
    this.backupPending = true;
  }

  static needsBackup(): boolean {
    return this.backupPending;
  }

  static async performBackupIfNeeded() {
    if (!this.needsBackup())
      return;

    console.log('💾 Performing scheduled backup...');
    await IncrementalBackupService.createEncryptedBackup();
    this.backupPending = false;
  }
}

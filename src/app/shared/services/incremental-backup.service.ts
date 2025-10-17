import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { db } from '@/services/app-database.service';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { decryptData, encryptData } from '@/utils/crypto.utils';

const SECRET_KEY = environment.BACKUP_SECRET_KEY;
const BACKUP_FILE_NAME = 'PflanzenABC-backup.json';
const BACKUP_DIR = 'PflanzenABC/Backups';

export class IncrementalBackupService {

  static async createEncryptedBackup() {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('💻 Backup skipped: running on web');
      return;
    }

    try {
      const plants = await db.plants.toArray();
      const collections = await db.collections.toArray();
      const choices = await db.choices.toArray();
      const images = await db.images.toArray();

      const backupData = {
        plants,
        collections,
        choices,
        images,
        createdAt: new Date().toISOString(),
      };

      const encrypted = await encryptData(backupData, SECRET_KEY);

      await Filesystem.writeFile({
        path: `${BACKUP_DIR}/${BACKUP_FILE_NAME}`,
        data: encrypted,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true
      });

      console.log('✅ Full backup created/updated successfully');

    } catch (e) {
      console.error('❌ Error creating backup:', e);
    }
  }

  static async restoreBackup() {
    try {
      const file = await Filesystem.readFile({
        path: `${BACKUP_DIR}/${BACKUP_FILE_NAME}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      const decrypted = await decryptData(file.data as string, SECRET_KEY);
      const data = JSON.parse(decrypted);

      await db.transaction('rw', db.plants, db.collections, db.choices, db.images, async () => {
        await Promise.all([
          db.plants.bulkPut(data.plants || []),
          db.collections.bulkPut(data.collections || []),
          db.choices.bulkPut(data.choices || []),
          db.images.bulkPut(data.images || []),
        ]);
      });

      console.log('✅ Backup restored successfully');

    } catch (err: any) {
      if (err.code === 'FILE_NOT_FOUND' || err.message?.includes('File does not exist')) {
        console.warn('⚠️ No backup found to restore.');
      } else {
        console.error('❌ Error restoring backup:', err);
      }
    }
  }
}
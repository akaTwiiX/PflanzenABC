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
    
    let existingData: any = { plants: [], collections: [], choices: [], images: [] };
    try {
      const file = await Filesystem.readFile({
        path: `${BACKUP_DIR}/${BACKUP_FILE_NAME}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      const decrypted = await decryptData(file.data as string, SECRET_KEY);
      existingData = JSON.parse(decrypted);
    } catch {
      console.log('⚠️ No existing backup, creating new one.');
    }

    const plants = await db.plants.toArray();
    const collections = await db.collections.toArray();
    const choices = await db.choices.toArray();
    const images = await db.images.toArray();

    const updatedData = {
      plants: plants.filter(p => !existingData.plants.some((ep: any) => ep.id === p.id && ep.updatedAt === p.updatedAt)),
      collections: collections.filter(c => !existingData.collections.some((ec: any) => ec.id === c.id && ec.updatedAt === c.updatedAt)),
      choices: choices.filter(ch => !existingData.choices.some((ec: any) => ec.id === ch.id && ec.updatedAt === ch.updatedAt)),
      images: images.filter(i => !existingData.images.some((ei: any) => ei.id === i.id && ei.updatedAt === i.updatedAt)),
      createdAt: new Date().toISOString(),
    };

    try {
      await Filesystem.mkdir({ path: BACKUP_DIR, directory: Directory.Documents, recursive: true });
    } catch { console.log('⚠️ Backup directory already exists.'); }

    const mergedData = {
      plants: [...existingData.plants, ...updatedData.plants],
      collections: [...existingData.collections, ...updatedData.collections],
      choices: [...existingData.choices, ...updatedData.choices],
      images: [...existingData.images, ...updatedData.images],
      createdAt: new Date().toISOString(),
    };

    const encrypted = await encryptData(mergedData, SECRET_KEY);
    await Filesystem.writeFile({
      path: `${BACKUP_DIR}/${BACKUP_FILE_NAME}`,
      data: encrypted,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    console.log('✅ Incremental backup updated');
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

      console.log('✅ Backup restored incrementally');
    } catch (err) {
      console.warn('⚠️ No backup found to restore.');
    }
  }
}

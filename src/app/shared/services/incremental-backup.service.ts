import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { db } from '@/services/app-database.service';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { decryptData, encryptData } from '@/utils/crypto.utils';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db as firestoreDb } from './firebase';
import { signal } from '@angular/core';
import { Dexie } from 'dexie';

const SECRET_KEY = environment.BACKUP_SECRET_KEY;
const BACKUP_FILE_NAME = 'PflanzenABC-backup.json';
const BACKUP_DIR = 'PflanzenABC/Backups';

export class IncrementalBackupService {
  static backupAvailable = signal(false);

  static async createEncryptedBackup() {
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

      this.createOrUpdateBackup(encrypted);
      this.backupAvailable.set(true);
      console.log('✅ Full backup created/updated successfully');
    } catch (e) {
      console.error('❌ Error creating backup:', e);
    }
  }

  static async restoreBackup() {
    try {
      const file = await this.getBackup();
      if (!file || !file['data']) {
        console.warn('⚠️ No backup data found to restore.');
        return;
      }

      const data = await decryptData(file['data'] as string, SECRET_KEY);

      await db.transaction('rw', db.plants, db.collections, db.choices, db.images, async () => {
        await Promise.all([
          this.addIfNotExists(db.plants, data.plants || []),
          this.addIfNotExists(db.collections, data.collections || []),
          this.addIfNotExists(db.choices, data.choices || []),
          this.addIfNotExists(db.images, data.images || []),
        ]);
      });

      console.log('✅ Backup restored successfully');
      this.backupAvailable.set(true);
    } catch (err: any) {
      if (err.code === 'FILE_NOT_FOUND' || err.message?.includes('File does not exist')) {
        console.warn('⚠️ No backup found to restore.');
      } else {
        console.error('❌ Error restoring backup:', err);
      }
    }
  }

  static async getBackup() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const ref = doc(firestoreDb, 'backups', user.uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      console.warn('⚠️ No backup found for user:', user.email);
      return null;
    }
  }

  static async createOrUpdateBackup(encrypted: string) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const ref = doc(firestoreDb, 'backups', user.uid);
    setDoc(ref, { data: encrypted, updatedAt: new Date() }, { merge: true });
    console.log('✅ Backup updated in Firestore for user:', user.email);
  }

  private static async addIfNotExists<T>(table: Dexie.Table<T, any>, items: T[]) {
    for (const item of items) {
      try {
        const id = (item as any).id;
        const exists = await table.get(id);
        if (!exists) {
          await table.add(item);
        }
      } catch (err) {
        console.warn('⚠️ Skipped existing or invalid entry:', err);
      }
    }
  }
}

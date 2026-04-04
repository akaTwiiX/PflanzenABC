import { inject, Injectable, signal } from '@angular/core';
import type {
  User,
} from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/shared/services/firebase';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private toastCtrl = inject(ToastController);

  currentUser = signal<User | null>(null);

  async register(email: string, password: string): Promise<{ success: boolean, message: string, }> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await sendEmailVerification(user);
      console.log('📨 Verification email sent to', user.email);

      return {
        success: true,
        message:
          'Registrierung erfolgreich! Bitte überprüfe deine E-Mail und bestätige dein Konto.',
      };
    } catch (error: any) {
      console.error('❌ Registration failed:', error);

      const message = this.mapFirebaseError(error.code);
      return { success: false, message };
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean, message: string, code?: string, }> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        console.log('📨 Verification email re-sent to', user.email);
        await auth.signOut();
        return {
          success: false,
          code: 'unverified',
          message: 'Bitte bestätige zuerst deine E-Mail-Adresse, bevor du dich einloggst.',
        };
      }

      console.log('✅ Login successful:', user.email);
      return { success: true, message: 'Erfolgreich eingeloggt.' };
    } catch (error: any) {
      console.error('❌ Login failed:', error);

      const message = this.mapFirebaseError(error.code);
      return { success: false, message };
    }
  }

  async logout(): Promise<void> {
    await auth.signOut();
    const toast = await this.toastCtrl.create({
      message: 'Erfolgreich ausgeloggt.',
      duration: 2000,
      color: 'medium',
    });
    toast.present();
  }

  private mapFirebaseError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Diese E-Mail-Adresse ist bereits registriert.';
      case 'auth/invalid-email':
        return 'Die eingegebene E-Mail-Adresse ist ungültig.';
      case 'auth/weak-password':
        return 'Das Passwort ist zu schwach. Bitte wähle ein stärkeres Passwort.';
      case 'auth/user-not-found':
        return 'Kein Konto mit dieser E-Mail-Adresse gefunden.';
      case 'auth/wrong-password':
        return 'Das eingegebene Passwort oder die E-Mail-Adresse ist falsch.';
      case 'auth/too-many-requests':
        return 'Zu viele fehlgeschlagene Anmeldeversuche. Bitte versuche es später erneut.';
      default:
        return 'Ein unbekannter Fehler ist aufgetreten.';
    }
  }
}

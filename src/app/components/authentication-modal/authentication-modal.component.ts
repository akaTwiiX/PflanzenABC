import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '@/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonButton, IonInput, IonLabel, IonItem, IonIcon,
  IonList, IonText, IonHeader, IonToolbar, IonTitle, IonFooter, IonToggle,
  ModalController, AlertController, ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-authentication-modal',
  templateUrl: './authentication-modal.component.html',
  styleUrls: ['./authentication-modal.component.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonButton, IonInput, IonLabel, IonItem,
    IonList, IonText, IonHeader, IonToolbar, IonTitle, IonFooter, IonIcon
  ],
})
export class AuthenticationModalComponent {
  private modalCtrl = inject(ModalController);
  private authService = inject(AuthService);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);


  mode: 'login' | 'register' = 'login';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  dismiss() {
    this.modalCtrl.dismiss();
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.confirmPassword = '';
  }

  async submit() {
    this.loading = true;

    if (this.mode === 'register' && this.password !== this.confirmPassword) {
      this.loading = false;
      return this.showToast('Die Passwörter stimmen nicht überein.', 'danger');
    }

    let result: { success: boolean; message: string, code?: string };

    try {
      if (this.mode === 'login') {
        result = await this.authService.login(this.email, this.password);

        if (result.code === 'unverified') {
          await this.showAlert('E-Mail-Bestätigung erforderlich', result.message);
          return;
        }

      } else {
        result = await this.authService.register(this.email, this.password);

        if (result.success) {
          await this.showAlert('Bestätigung erforderlich', result.message);
          this.toggleMode();
          return;
        }
      }

      this.showToast(result.message, result.success ? 'success' : 'danger');

      if (result.success && this.mode === 'login') {
        this.dismiss();
      }
    } catch (err) {
      console.error(err);
      this.showToast('Ein unbekannter Fehler ist aufgetreten.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    toast.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
